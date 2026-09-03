import express from "express"
import adminService from "../controllers/admin/adminController.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminService.getAllUsers)
router.get("/products", protect.forAdmin, adminService.getAllProducts)
router.post("/product", protect.forAdmin, upload.single('image'), adminService.addProduct)
router.put("/product/:pid", protect.forAdmin, adminService.updateProduct)


export default router