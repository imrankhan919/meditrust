import express from "express"
import authService from "../controllers/auth/authController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()


router.post("/register", authService.registerUser)
router.post("/login", authService.loginUser)
router.get("/me", protect, authService.getMyProfile)


export default router