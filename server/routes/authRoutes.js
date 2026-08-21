import express from "express"
import authService from "../controllers/auth/authController.js"

const router = express.Router()


router.post("/register", authService.registerUser)
router.post("/login", authService.loginUser)


export default router