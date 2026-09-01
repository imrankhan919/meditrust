import express from "express"
import adminService from "../controllers/admin/adminController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminService.getAllUsers)
router.get("/products", protect.forAdmin, adminService.getAllProducts)


export default router