import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/fileUploadMiddleware.js";
import { scanRateLimit } from "../middleware/scanRateLimitMiddleware.js";
import prescriptionController from "../controllers/prescription/prescriptionController.js";

const router = express.Router();

router.post(
    "/upload-scan",
    protect.forUser,
    scanRateLimit,
    upload.single("prescription"),
    prescriptionController.uploadScan
);
router.get("/", protect.forUser, prescriptionController.listPrescriptions);
// NOTE: /scan-status must precede /:id routes or Express matches "scan-status" as an id.
router.get("/scan-status", protect.forUser, prescriptionController.getScanStatus);
router.get("/:id/image", protect.forUser, prescriptionController.getPrescriptionImage);
router.get("/:id/matches", protect.forUser, prescriptionController.getMatches);
router.get("/:id", protect.forUser, prescriptionController.getPrescription);
router.patch("/:id", protect.forUser, prescriptionController.updatePrescription);
router.delete("/:id", protect.forUser, prescriptionController.deletePrescription);

export default router;
