import { GoogleGenAI } from "@google/genai";
import fs from "node:fs"
import uploadToCloudinary from "../../middleware/cloudinaryMiddleware.js";


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
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const base64 = fileToBase64(req.file.path);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
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

        res.status(200).json({
            data: data,
            image: image.secure_url
        })


    } catch (err) {
        fs.unlinkSync(req.file.path); // cleanup temp file
        console.error(err);
        res.status(500).json({ error: "Extraction failed", details: err.message });
    }
}


const aiController = {
    explainPrescription
}

export default aiController