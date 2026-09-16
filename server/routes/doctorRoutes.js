import express from "express"
import protect from "../middleware/authMiddleware.js"
import doctorController from "../controllers/pathologist/doctorController.js"

const router = express.Router()


router.get("/", doctorController.getAllDoctors)
router.get("/appointments", protect.forUser, doctorController.getAllAppointments)
router.get("/appointments/:aid", protect.forUser, doctorController.getAppointment)

router.post("/request", protect.forUser, doctorController.becomeDoctor)
router.post("/:did", protect.forUser, doctorController.bookAppointment)

router.put("/appointments/:aid", protect.forUser, doctorController.updateAppointment)


export default router