import mongoose from "mongoose";
import fs from "node:fs";
import { GoogleGenAI } from "@google/genai";
import Prescription from "../../models/prescriptionModel.js";
import Product from "../../models/productModel.js";
import {
    getPrescriptionSignedUrl,
    uploadPrescriptionImage,
} from "../../middleware/cloudinaryMiddleware.js";
import { recordScanHit, getScanBudget } from "../../middleware/scanRateLimitMiddleware.js";

import { GEMINI_MODEL, getGeminiModel } from "../../config/aiConfig.js";

function getAiClient() {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Model name lives in server/config/aiConfig.js (single source of truth).

const ALLOWED_SCAN_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SCAN_PROMPT = `
You are a medical prescription parser. Extract the following from this
prescription image and return ONLY valid JSON, no markdown fences, no explanation:

{
  "patient_name": null,
  "doctor_name": null,
  "clinic_name": null,
  "date": null,
  "medicines": [
    {
      "name": null,
      "strength": null,
      "dosage": null,
      "frequency": null,
      "duration": null,
      "instructions": null,
      "notes": null,
      "confidence": null,
      "needsReview": true
    }
  ],
  "diagnosis_notes": null,
  "additional_instructions": [],
  "unreadable_text": []
}

Rules:
- Use null for any illegible or missing value. Never invent medicine names,
  strengths, dosages, frequencies, or durations.
- confidence is a number 0-1 or null when unknown.
- Set needsReview true whenever a value is uncertain, illegible, or guessed from context.
- Put crossed-out or illegible spans in unreadable_text.
- Do not prescribe, recommend dosages, or give medical advice.
`;

function safeUnlink(filePath) {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch {
        // best-effort only
    }
}

function stripCodeFences(text) {
    if (!text) return text;
    return text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
}

function asNullableString(value, maxLen = 500) {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    if (!str) return null;
    return str.slice(0, maxLen);
}

function asStringArray(value, maxItems = 20) {
    if (!Array.isArray(value)) return [];
    return value
        .map((v) => asNullableString(v, 500))
        .filter(Boolean)
        .slice(0, maxItems);
}

function asNullableConfidence(value) {
    if (value === null || value === undefined || value === "") return null;
    const num = Number(value);
    if (!Number.isFinite(num)) return null;
    if (num < 0 || num > 1) return null;
    return num;
}

function normalizeMedicine(med) {
    if (!med || typeof med !== "object") {
        return {
            name: null, strength: null, dosage: null, frequency: null,
            duration: null, instructions: null, notes: "unreadable entry",
            confidence: null, needsReview: true,
        };
    }
    const confidence = asNullableConfidence(med.confidence);
    const needsReview =
        med.needsReview === true ||
        med.needsReview === "true" ||
        confidence === null ||
        (typeof confidence === "number" && confidence < 0.85) ||
        !asNullableString(med.name);
    return {
        name: asNullableString(med.name, 200),
        strength: asNullableString(med.strength, 100),
        dosage: asNullableString(med.dosage, 200),
        frequency: asNullableString(med.frequency, 200),
        duration: asNullableString(med.duration, 200),
        instructions: asNullableString(med.instructions, 500),
        notes: asNullableString(med.notes, 500),
        confidence,
        needsReview,
    };
}

function normalizeExtraction(data) {
    const source = data && typeof data === "object" ? data : {};
    const medicines = Array.isArray(source.medicines)
        ? source.medicines.slice(0, 50).map(normalizeMedicine)
        : [];
    return {
        patient_name: asNullableString(source.patient_name, 200),
        doctor_name: asNullableString(source.doctor_name, 200),
        clinic_name: asNullableString(source.clinic_name, 200),
        date: asNullableString(source.date, 100),
        medicines,
        diagnosis_notes: asNullableString(source.diagnosis_notes, 2000),
        additional_instructions: asStringArray(source.additional_instructions),
        unreadable_text: asStringArray(source.unreadable_text),
    };
}

// Google's own error text (model name, API version, status) carries no
// secrets, but cap its length before echoing it in API responses.
function googleDetails(err, maxLen = 300) {
    const text = String(err?.message || "").trim();
    if (!text) return null;
    return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

function mapGeminiError(err) {
    const message = err?.message || "Extraction failed";
    const status = err?.status ?? err?.code;
    if (status === 429 || /quota|rate limit|429/i.test(message)) {
        return { statusCode: 429, error: "AI service is rate-limited. Please try again shortly.", retryable: true };
    }
    // Invalid credentials: Google reports 400 INVALID_ARGUMENT ("API key not
    // valid"), 401, or 403. Never blame the model name for these.
    if (
        status === 400 || status === 401 || status === 403 ||
        /api[_\- ]?key not valid|invalid[_\- ]?(api[_\- ]?)?key|permission[_\- ]denied|unauthenticated|unauthorized/i.test(message)
    ) {
        return { statusCode: 500, error: "AI service credentials were rejected. Check GEMINI_API_KEY server configuration." };
    }
    // Overloaded / temporarily unavailable: Google reports 503 UNAVAILABLE
    // ("high demand", "overloaded"). Retryable, but only by an explicit
    // user action — the frontend never auto-retries.
    if (status === 503 || /high demand|overloaded|temporarily unavailable/i.test(message)) {
        return { statusCode: 503, error: "AI service is temporarily overloaded. Please try again shortly.", retryable: true };
    }
    // Unknown model: numeric 404, or a message that BOTH names a model AND
    // reports it missing. A bare "model" substring alone proves nothing.
    if (
        status === 404 ||
        (/model/i.test(message) && /not[\s_-]?found/i.test(message))
    ) {
        return { statusCode: 502, error: "Configured AI model is unavailable. Please try again later." };
    }
    if (/timeout|timed out|deadline/i.test(message)) {
        return { statusCode: 504, error: "AI extraction timed out. Please retry with a clearer image." };
    }
    return { statusCode: 500, error: "Extraction failed" };
}

function ownerId(req) {
    return req.user._id || req.user.id;
}

function assertObjectId(id, res) {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ error: "Invalid prescription id" });
        return false;
    }
    return true;
}

// POST /api/prescriptions/upload-scan
const uploadScan = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No image uploaded. Upload a JPEG, PNG, or WEBP prescription image." });
    }
    if (!ALLOWED_SCAN_MIME_TYPES.includes(req.file.mimetype)) {
        safeUnlink(req.file.path);
        return res.status(400).json({ error: "Unsupported file type. Only JPEG, PNG, and WEBP images are allowed." });
    }
    if (!process.env.GEMINI_API_KEY) {
        safeUnlink(req.file.path);
        return res.status(500).json({ error: "AI service is not configured on the server." });
    }

    try {
        const base64 = fs.readFileSync(req.file.path).toString("base64");

        const response = await getAiClient().models.generateContent({
            model: GEMINI_MODEL,
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: SCAN_PROMPT },
                        { inlineData: { mimeType: req.file.mimetype, data: base64 } },
                    ],
                },
            ],
            config: { responseMimeType: "application/json" },
        });

        let parsed;
        try {
            parsed = JSON.parse(stripCodeFences(response.text));
        } catch {
            safeUnlink(req.file.path);
            return res.status(502).json({ error: "AI returned an unreadable response. Please retry with a clearer image." });
        }
        const normalized = normalizeExtraction(parsed);

        let uploadResult = null;
        try {
            uploadResult = await uploadPrescriptionImage(req.file.path);
        } finally {
            safeUnlink(req.file.path);
        }

        if (!uploadResult?.secure_url || !uploadResult?.public_id) {
            return res.status(502).json({ error: "Prescription image storage failed. Please retry." });
        }

        const prescription = await Prescription.create({
            user: ownerId(req),
            patient_name: normalized.patient_name,
            doctor_name: normalized.doctor_name,
            clinic_name: normalized.clinic_name,
            date: normalized.date,
            medicines: normalized.medicines,
            diagnosis_notes: normalized.diagnosis_notes,
            additional_instructions: normalized.additional_instructions,
            unreadable_text: normalized.unreadable_text,
            status: "needs_review",
            isConfirmed: false,
            confirmedAt: null,
            image: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
            imageAccess: "authenticated",
        });

        // Success-only accounting: failed scans must not consume scan budget.
        recordScanHit(req);

        res.status(201).json(prescription);
    } catch (err) {
        safeUnlink(req.file?.path);
        const mapped = mapGeminiError(err);
        // Concise server-side log: status only. Never log API keys, tokens,
        // image data, filenames, or prescription/patient details.
        console.error(`[prescription-scan] scan failed with status ${mapped.statusCode}`);
        const body = { error: mapped.error };
        if (mapped.retryable) body.retryable = true;
        const details = googleDetails(err);
        if (details) body.details = details;
        return res.status(mapped.statusCode).json(body);
    }
};

// GET /api/prescriptions/scan-status — safe per-user budget diagnostic.
// Returns counts only: never user ids, tokens, images, or patient data.
const getScanStatus = async (req, res) => {
    res.status(200).json(getScanBudget(req));
};

// GET /api/prescriptions
const listPrescriptions = async (req, res) => {
    const items = await Prescription.find({ user: ownerId(req) })
        .sort({ createdAt: -1 })
        .select("-imagePublicId")
        .lean();
    res.status(200).json(items);
};

// GET /api/prescriptions/:id
const getPrescription = async (req, res) => {
    if (!assertObjectId(req.params.id, res)) return;
    const item = await Prescription.findOne({ _id: req.params.id, user: ownerId(req) })
        .select("-imagePublicId")
        .lean();
    if (!item) return res.status(404).json({ error: "Prescription not found" });
    res.status(200).json(item);
};

// PATCH /api/prescriptions/:id — edit extracted fields; { confirm: true } marks reviewed
const updatePrescription = async (req, res) => {
    if (!assertObjectId(req.params.id, res)) return;
    const allowed = [
        "patient_name", "doctor_name", "clinic_name", "date",
        "medicines", "diagnosis_notes", "additional_instructions", "unreadable_text",
    ];
    const update = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    if (update.medicines !== undefined) {
        if (!Array.isArray(update.medicines)) {
            return res.status(400).json({ error: "medicines must be an array" });
        }
        if (update.medicines.length > 50) {
            return res.status(400).json({ error: "Too many medicines (max 50)" });
        }
        update.medicines = update.medicines.map(normalizeMedicine);
    }
    if (update.additional_instructions !== undefined) {
        update.additional_instructions = asStringArray(update.additional_instructions);
    }
    if (update.unreadable_text !== undefined) {
        update.unreadable_text = asStringArray(update.unreadable_text);
    }
    for (const k of ["patient_name", "doctor_name", "clinic_name"]) {
        if (update[k] !== undefined) update[k] = asNullableString(update[k], 200);
    }
    if (update.date !== undefined) update.date = asNullableString(update.date, 100);
    if (update.diagnosis_notes !== undefined) {
        update.diagnosis_notes = asNullableString(update.diagnosis_notes, 2000);
    }

    if (req.body.confirm === true) {
        update.status = "confirmed";
        update.isConfirmed = true;
        update.confirmedAt = new Date();
    } else if (Object.keys(update).length > 0 && req.body.status === undefined) {
        update.status = "needs_review";
        update.isConfirmed = false;
        update.confirmedAt = null;
    }

    const item = await Prescription.findOneAndUpdate(
        { _id: req.params.id, user: ownerId(req) },
        { $set: update },
        { new: true, runValidators: true }
    ).select("-imagePublicId");

    if (!item) return res.status(404).json({ error: "Prescription not found" });
    res.status(200).json(item);
};

// DELETE /api/prescriptions/:id
const deletePrescription = async (req, res) => {
    if (!assertObjectId(req.params.id, res)) return;
    const item = await Prescription.findOneAndDelete({ _id: req.params.id, user: ownerId(req) });
    if (!item) return res.status(404).json({ error: "Prescription not found" });
    // Note: Cloudinary asset is retained to avoid destructive deletes;
    // orphaned private assets can be purged by an admin job later.
    res.status(200).json({ message: "Prescription deleted" });
};

// GET /api/prescriptions/:id/image — ownership-checked signed access
const getPrescriptionImage = async (req, res) => {
    if (!assertObjectId(req.params.id, res)) return;
    const item = await Prescription.findOne({ _id: req.params.id, user: ownerId(req) })
        .select("+imagePublicId image imageAccess")
        .lean();
    if (!item) return res.status(404).json({ error: "Prescription not found" });

    if (item.imageAccess === "authenticated" && item.imagePublicId) {
        const signedUrl = getPrescriptionSignedUrl(item.imagePublicId);
        if (!signedUrl) return res.status(502).json({ error: "Could not sign image URL" });
        return res.status(200).json({ signedUrl, expiresInSeconds: 300, private: true });
    }
    // Legacy public-URL records: still require auth + ownership to discover,
    // but the underlying URL remains publicly fetchable if previously shared.
    if (item.image) {
        return res.status(200).json({ imageUrl: item.image, legacy: true, private: false });
    }
    return res.status(404).json({ error: "No image stored for this prescription" });
};

function normalizeName(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function coreTokens(value) {
    const stop = new Set(["mg", "ml", "g", "mcg", "tablet", "tablets", "capsule", "capsules", "syrup", "injection", "drops"]);
    return normalizeName(value)
        .split(" ")
        .filter((t) => t && !stop.has(t) && !/\d/.test(t));
}

function isExpiredProduct(product) {
    if (!product?.expiresOn) return false;
    const d = new Date(product.expiresOn);
    if (Number.isNaN(d.getTime())) return false;
    return d < new Date();
}

// GET /api/prescriptions/:id/matches — conservative name-based catalog matching.
// Uses only real Product fields (name/price/stock/expiresOn/isActive).
// No generic/salt inference: the Product collection has no such fields.
const getMatches = async (req, res) => {
    if (!assertObjectId(req.params.id, res)) return;
    const prescription = await Prescription.findOne({ _id: req.params.id, user: ownerId(req) }).lean();
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });

    const products = await Product.find({ isActive: true }).lean();
    const results = (prescription.medicines || []).map((med) => {
        const prescribed = asNullableString(med?.name) || "";
        const wanted = coreTokens(prescribed);
        let best = null;
        let bestScore = 0;
        for (const p of products) {
            const have = coreTokens(p.name);
            if (!wanted.length || !have.length) continue;
            const overlap = wanted.filter((t) => have.includes(t)).length;
            const score = overlap / Math.max(wanted.length, have.length);
            const exact = normalizeName(prescribed) === normalizeName(p.name);
            const finalScore = exact ? 1 : score;
            if (finalScore > bestScore) {
                bestScore = finalScore;
                best = p;
            }
        }
        const confidence = bestScore >= 0.99 ? "high" : bestScore >= 0.6 ? "medium" : bestScore >= 0.34 ? "low" : "none";
        const expired = best ? isExpiredProduct(best) : false;
        const inStock = best ? (best.stock > 0 && !expired) : false;
        const usable = best && (confidence === "high" || confidence === "medium") && inStock;
        return {
            prescribed_name: prescribed || null,
            matched_product_id: usable ? String(best._id) : null,
            matched_product_name: usable ? best.name : null,
            match_confidence: confidence,
            needsReview: !usable,
            available: Boolean(usable),
            reason: !best || confidence === "none"
                ? "no matching product found"
                : expired ? "matched product expired" : best.stock <= 0 ? "matched product out of stock" : confidence === "low" ? "ambiguous match — needs review" : "in stock, active",
            price: usable ? best.price : null,
            stock: usable ? best.stock : null,
        };
    });

    res.status(200).json({
        prescriptionId: String(prescription._id),
        medicines: results,
        summary: {
            total_medicines_prescribed: results.length,
            medicines_available: results.filter((r) => r.available).length,
            medicines_unavailable: results.filter((r) => !r.available).length,
        },
        limitation: "Name-based matching only. The product catalog has no generic/salt fields, so composition-based alternatives are not supported.",
    });
};

const prescriptionController = {
    uploadScan,
    listPrescriptions,
    getScanStatus,
    getPrescription,
    updatePrescription,
    deletePrescription,
    getPrescriptionImage,
    getMatches,
    // exported for offline unit tests (no DB/Gemini needed)
    _test: { normalizeExtraction, normalizeMedicine, coreTokens, isExpiredProduct, mapGeminiError, getGeminiModel, googleDetails },
};

export { getGeminiModel };

export default prescriptionController;
