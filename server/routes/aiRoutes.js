import express from "express"
import protect from "../middleware/authMiddleware.js"
import aiController from "../controllers/ai/aiController.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()


router.post("/prescription", protect.forUser, upload.single('prescription'), aiController.explainPrescription)


export default router