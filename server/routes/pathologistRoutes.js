import express from "express"
import protect from "../middleware/authMiddleware.js"
import pathologistController from "../controllers/pathologist/pathologistController.js"

const router = express.Router()


router.post("/request", protect.forUser, pathologistController.becomePathologist)
router.post("/add", protect.forUser, pathologistController.addPathologyTest)
router.post("/:pid", protect.forUser, pathologistController.bookTest)


export default router