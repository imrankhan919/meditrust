import express from "express"
import protect from "../middleware/authMiddleware.js"
import pathologistController from "../controllers/pathologist/pathologistController.js"

const router = express.Router()


router.get("/tests", protect.forUser, pathologistController.getAllPathologyTests)
router.get("/appointments", protect.forUser, pathologistController.getAllAppointments)
router.get("/appointments/:aid", protect.forUser, pathologistController.getAppointment)

router.post("/request", protect.forUser, pathologistController.becomePathologist)
router.post("/add", protect.forUser, pathologistController.addPathologyTest)
router.post("/:pid", protect.forUser, pathologistController.bookTest)

router.put("/appointments/:aid", protect.forUser, pathologistController.updateAppointment)


export default router