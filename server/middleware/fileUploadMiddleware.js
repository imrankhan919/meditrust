import multer from "multer"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Temp dir for incoming uploads (cleaned up after Cloudinary upload).
// Resolved from this file so it works no matter where the server is started from.
const uploadDir = path.join(__dirname, "..", "..", "uploads")

// Multer never creates the destination folder itself, so ensure it exists.
fs.mkdirSync(uploadDir, { recursive: true })


// Allowed prescription image types. Keep in sync with frontend accept attr
// and Gemini inlineData image support (JPEG/PNG/WEBP).
export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// 5MB: large enough for phone photos, small enough for Gemini inlineData
// + Cloudinary + MongoDB-adjacent latency. Raise only after testing.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(null, true);
    }
    const err = new Error("Only JPEG, JPG, PNG, and WEBP images are allowed");
    err.statusCode = 400;
    return cb(err);
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
        const fileName = crypto.randomUUID() + ext;
        cb(null, fileName)
    }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
    fileFilter: fileFilter,
})


export default upload