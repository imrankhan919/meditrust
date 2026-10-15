import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import uploadToCloudinary from "../../middleware/cloudinaryMiddleware.js";
import Prescription from "../../models/prescriptionModel.js";
import Product from "../../models/productModel.js";
import Pathologist from "../../models/pathologistModel.js";

import { GEMINI_MODEL } from "../../config/aiConfig.js";

function getAiClient() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Model name lives in server/config/aiConfig.js (single source of truth).

const ALLOWED_SCAN_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const PROMPT = `
You are a medical prescription parser. Extract the following from this 
prescription image and return ONLY valid JSON, no markdown fences, no explanation:

{
  "patient_name": null,
  "doctor_name": null,
  "date": null,
  "medicines": [
    {
      "name": null,
      "dosage": null,
      "frequency": null,
      "duration": null,
      "notes": null
    }
  ],
  "diagnosis_notes": null
}

If any field is illegible or missing, use null. Do not guess medicine names 
you're not confident about — flag uncertain reads in "notes" instead.
`;

function fileToBase64(path) {
  return fs.readFileSync(path).toString("base64");
}

function safeUnlink(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Best-effort temp cleanup; never mask the original error.
  }
}

function stripCodeFences(text) {
  if (!text) return text;
  return text
    .replace(/```(?:json)?/gi, "")
    .replace(/```/g, "")
    .trim();
}

function asNullableString(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str ? str : null;
}

function normalizeMedicines(medicines) {
  if (!Array.isArray(medicines)) return [];
  return medicines.slice(0, 50).map((med) => {
    if (!med || typeof med !== "object") {
      return {
        name: null,
        dosage: null,
        frequency: null,
        duration: null,
        notes: "unreadable entry",
      };
    }
    return {
      name: asNullableString(med.name),
      dosage: asNullableString(med.dosage),
      frequency: asNullableString(med.frequency),
      duration: asNullableString(med.duration),
      notes: asNullableString(med.notes),
    };
  });
}

function normalizeExtraction(data) {
  const source = data && typeof data === "object" ? data : {};
  return {
    patient_name: asNullableString(source.patient_name),
    doctor_name: asNullableString(source.doctor_name),
    date: asNullableString(source.date),
    medicines: normalizeMedicines(source.medicines),
    diagnosis_notes: asNullableString(source.diagnosis_notes),
  };
}

function mapGeminiError(err) {
  const message = err?.message || "Extraction failed";
  const status = err?.status ?? err?.code;
  if (status === 429 || /quota|rate limit|429/i.test(message)) {
    return {
      statusCode: 429,
      error: "AI service is rate-limited. Please try again shortly.",
    };
  }
  // Invalid credentials are a key problem, never a model problem.
  if (
    status === 400 || status === 401 || status === 403 ||
    /api[_\- ]?key not valid|invalid[_\- ]?(api[_\- ]?)?key|permission[_\- ]denied|unauthenticated|unauthorized/i.test(message)
  ) {
    return {
      statusCode: 500,
      error:
        "AI service credentials were rejected. Check GEMINI_API_KEY server configuration.",
    };
  }
  // Overloaded / temporarily unavailable: Google reports 503 UNAVAILABLE
  // ("high demand", "overloaded"). Retryable, but only by an explicit
  // user action — the frontend never auto-retries.
  if (status === 503 || /high demand|overloaded|temporarily unavailable/i.test(message)) {
    return {
      statusCode: 503,
      error: "AI service is temporarily overloaded. Please try again shortly.",
      retryable: true,
    };
  }
  // Unknown model: numeric 404, or a message that BOTH names a model AND
  // reports it missing. A bare "model" substring alone proves nothing.
  if (
    status === 404 ||
    (/model/i.test(message) && /not[\s_-]?found/i.test(message))
  ) {
    return {
      statusCode: 502,
      error: "Configured AI model is unavailable. Please try again later.",
    };
  }
  if (/timeout|timed out|deadline/i.test(message)) {
    return {
      statusCode: 504,
      error: "AI extraction timed out. Please retry with a clearer image.",
    };
  }
  return { statusCode: 500, error: "Extraction failed", details: message };
}

const explainPrescription = async (req, res) => {
  const userId = req.user._id || req.user.id;

  if (!req.file) {
    return res.status(400).json({
      error:
        "No image uploaded. Upload a JPEG, PNG, or WEBP prescription image.",
    });
  }

  if (!ALLOWED_SCAN_MIME_TYPES.includes(req.file.mimetype)) {
    safeUnlink(req.file.path);
    return res.status(400).json({
      error:
        "Unsupported file type. Only JPEG, PNG, and WEBP images are allowed.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    safeUnlink(req.file.path);
    return res
      .status(500)
      .json({ error: "AI service is not configured on the server." });
  }

  try {
    const base64 = fileToBase64(req.file.path);

    const response = await getAiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: PROMPT },
            {
              inlineData: {
                mimeType: req.file.mimetype,
                data: base64,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const image = await uploadToCloudinary(req.file.path);
    safeUnlink(req.file.path); // cleanup temp file in all paths

    if (!image?.secure_url) {
      return res
        .status(502)
        .json({ error: "Prescription image storage failed. Please retry." });
    }

    let data;
    try {
      data = JSON.parse(stripCodeFences(response.text));
    } catch {
      return res.status(502).json({
        error:
          "AI returned an unreadable response. Please retry with a clearer image.",
      });
    }
    const normalized = normalizeExtraction(data);

    const prescription = new Prescription({
      user: userId,
      patient_name: normalized.patient_name,
      doctor_name: normalized.doctor_name,
      date: normalized.date,
      medicines: normalized.medicines,
      diagnosis_notes: normalized.diagnosis_notes,
      image: image.secure_url,
    });

    await prescription.save();

    res.status(201).json(prescription);
  } catch (err) {
    safeUnlink(req.file?.path); // cleanup temp file
    const mapped = mapGeminiError(err);
    if (mapped.details) {
      return res
        .status(mapped.statusCode)
        .json({ error: mapped.error, details: mapped.details });
    }
    return res.status(mapped.statusCode).json({ error: mapped.error });
  }
};

const findMedicines = async (req, res) => {
  const pid = req.params.pid;

  if (!process.env.GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "AI service is not configured on the server." });
  }

  try {
    const products = await Product.find().lean();
    const pathologists = await Pathologist.find().lean();
    const prescription = await Prescription.findById(pid).lean();

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    const MEDICINE_FOUNDER_PROMPT = `You are a medicine and pathology-test availability checker for a healthcare platform.

You will receive THREE pieces of data in JSON:
1. "products" — the pharmacy's inventory (id, name, description, price, stock, expiresOn, isActive)
2. "pathologists" — labs/diagnostic centers with their specializations and fees
3. "medicines" — a list of medicines extracted via OCR from a doctor's prescription (name, dosage, frequency, duration, notes)

YOUR TASK:
For each entry in "medicines", determine whether it is available in "products" using fuzzy/partial name matching (OCR text is often noisy — e.g. "O-claram-625" may match "Amoxyclav 625" or similar; match on best semantic/brand similarity, not exact string equality). Only mark a product as available if isActive is true, stock > 0, and it is not expired (compare expiresOn to today's date).

If any prescription line looks like a lab test / diagnostic order rather than a medicine (e.g. "CBC", "CT Scan", "Blood Sugar"), match it against pathologists' "specialization" arrays instead, and list which labs offer it, their consultationFee, and availableDays/workingHours.

OUTPUT FORMAT — return ONLY valid JSON, no preamble, no markdown fences:

{
  "medicines": [
    {
      "prescribed_name": "<name as it appeared on prescription>",
      "matched_product_name": "<name from products, or null if no match found>",
      "match_confidence": "high" | "medium" | "low" | "none",
      "available": true | false,
      "reason": "<short reason, e.g. 'in stock, active' / 'out of stock' / 'expired' / 'no matching product found'>",
      "price": <number or null>,
      "stock": <number or null>,
      "dosage": "<from prescription, if any>",
      "duration": "<from prescription, if any>"
    }
  ],
  "tests": [
    {
      "prescribed_test": "<test name as extracted>",
      "available_labs": [
        {
          "laboratoryName": "<string>",
          "laboratoryAddress": "<string>",
          "consultationFee": <number>,
          "availableDays": [<strings>],
          "workingHours": { "start": "<string>", "end": "<string>" }
        }
      ]
    }
  ],
  "summary": {
    "total_medicines_prescribed": <number>,
    "medicines_available": <number>,
    "medicines_unavailable": <number>,
    "tests_prescribed": <number>,
    "tests_with_available_labs": <number>
  }
}

RULES:
- Never invent a product, price, or lab that isn't in the provided data.
- If a prescription entry's "notes" says it's crossed out or unclear, still attempt a match but flag match_confidence as "low" and add a note.
- Be conservative: if you're not reasonably confident of a match, set matched_product_name to null and available to false rather than guessing.
- Do not include any explanation outside the JSON object.

Here is the data: ${JSON.stringify({ products, pathologists, medicines: prescription.medicines })}
`;

    const response = await getAiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: MEDICINE_FOUNDER_PROMPT }],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text; // property, not a function, in the new SDK
    let data;
    try {
      data = JSON.parse(stripCodeFences(rawText));
    } catch {
      return res.status(502).json({
        error: "AI returned an unreadable response. Please try again shortly.",
      });
    }

    return res.json(data);
  } catch (error) {
    const mapped = mapGeminiError(error);
    if (mapped.details) {
      return res
        .status(mapped.statusCode)
        .json({ error: mapped.error, details: mapped.details });
    }
    return res.status(mapped.statusCode).json({ error: mapped.error });
  }
};

const chatWithAi = async (req, res) => {
  const text = req.body?.text ?? req.query?.text;

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: "Please provide a message." });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ error: "AI service is not configured on the server." });
  }

  const SYSTEM_INSTRUCTION = `You are MediTrust's basic health guidance assistant. Rules you MUST follow:
- Give only general, non-diagnostic health information.
- Never provide a diagnosis and never recommend specific dosages.
- Keep answers short and easy to understand.
- Always suggest booking a real doctor on MediTrust for anything specific or urgent.
- If the question is an emergency or serious symptom, urge seeking immediate professional care. here is my query : ${text}`;

  try {
    const response = await getAiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: "user",
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
      ],
    });

    const reply = (response.text || "").trim();
    if (!reply) {
      return res.status(502).json({
        error: "AI returned an empty response. Please try again shortly.",
      });
    }

    return res.json({ reply });
  } catch (error) {
    const mapped = mapGeminiError(error);
    if (mapped.details) {
      return res
        .status(mapped.statusCode)
        .json({ error: mapped.error, details: mapped.details });
    }
    return res.status(mapped.statusCode).json({ error: mapped.error });
  }
};

const aiController = {
  explainPrescription,
  findMedicines,
  chatWithAi,
};

export default aiController;
