import express from "express"
import adminService from "../controllers/admin/adminController.js"
import protect from "../middleware/authMiddleware.js"
import upload from "../middleware/fileUploadMiddleware.js"

const router = express.Router()

router.get("/users", protect.forAdmin, adminService.getAllUsers)
router.get("/products", protect.forAdmin, adminService.getAllProducts)
router.get("/pathologists", protect.forAdmin, adminService.getAllPathologists)

router.post("/product", protect.forAdmin, upload.single('image'), adminService.addProduct)

router.put("/product/:pid", protect.forAdmin, adminService.updateProduct)
router.put("/pathologists/:pid", protect.forAdmin, adminService.updatePathologist)


export default router