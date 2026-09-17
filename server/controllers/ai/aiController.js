import { GoogleGenAI } from "@google/genai";
import fs from "node:fs"
import uploadToCloudinary from "../../middleware/cloudinaryMiddleware.js";
import Prescription from "../../models/prescriptionModel.js";
import Product from "../../models/productModel.js";
import Pathologist from "../../models/pathologistModel.js";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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


const explainPrescription = async (req, res) => {

    let userId = req.user.id

    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const base64 = fileToBase64(req.file.path);

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
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

        const image = await uploadToCloudinary(req.file.path)
        fs.unlinkSync(req.file.path); // cleanup temp file

        const text = response.text; // property, not a function, in the new SDK
        const data = JSON.parse(text);

        const prescription = new Prescription({
            user: userId,
            patient_name: data.patient_name,
            doctor_name: data.doctor_name,
            date: data.date,
            medicines: data.medicines,
            diagnosis_notes: data.diagnosis_notes,
            image: image.secure_url
        })

        await prescription.save()
        await prescription.populate("user")

        res.status(200).json(prescription)


    } catch (err) {
        fs.unlinkSync(req.file.path); // cleanup temp file
        console.error(err);
        res.status(500).json({ error: "Extraction failed", details: err.message });
    }
}






const findMedicines = async (req, res) => {

    const pid = req.params.pid

    const products = await Product.find()
    const pathologists = await Pathologist.find()
    const prescription = await Prescription.findById(pid)

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

Here is the data: ${{ products, pathologists, medicines: prescription.medicines }}
`

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: MEDICINE_FOUNDER_PROMPT },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });


        const text = response.text; // property, not a function, in the new SDK
        const data = JSON.parse(text);

        res.json(data)


    } catch (error) {
        res.status(409)
        throw new Error("Error In Getting Data From Server!")
    }




    res.json({ products, pathologists, medicines: prescription.medicines })



}


const chatWithAi = async (req, res) => {

    const { text } = req.body

    if (!text) {
        res.status(409)
        throw new Error("Please Fill All Details")
    }

    const SYSTEM_INSTRUCTION = `You are MediTrust's basic health guidance assistant. Rules you MUST follow:
- Give only general, non-diagnostic health information.
- Never provide a diagnosis and never recommend specific dosages.
- Keep answers short and easy to understand.
- Always suggest booking a real doctor on MediTrust for anything specific or urgent.
- If the question is an emergency or serious symptom, urge seeking immediate professional care. here is my query : ${text}`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: SYSTEM_INSTRUCTION },
                    ],
                },
            ],
            config: {
                responseMimeType: "application/json",
            },
        });


        const text = response.text; // property, not a function, in the new SDK
        const data = JSON.parse(text);

        res.json(data)
    } catch (error) {
        console.log(error.message)
        res.status(409)
        throw new Error("Error In Getting Data From Server!")
    }





}









const aiController = {
    explainPrescription, findMedicines, chatWithAi
}

export default aiController


