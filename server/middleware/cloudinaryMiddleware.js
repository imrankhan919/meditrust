import { v2 as cloudinary } from 'cloudinary';
import fs from "node:fs"
import dotenv from "dotenv";
dotenv.config();


// Configuration
cloudinary.config({
    cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
    api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
    api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim()
});




const uploadToCloudinary = async (fileLink) => {


    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            fileLink, {
            resource_type: "auto"
        }
        )
        .catch((error) => {
            console.log(error);
            // If failes remove file from our server
            fs.unlinkSync(fileLink)
        });
    return uploadResult

}

// Private prescription uploads. Uses authenticated delivery so the raw
// Cloudinary URL cannot be fetched without a per-request signature.
// Legacy uploadToCloudinary above is intentionally untouched for product
// images and older prescription records.
export const uploadPrescriptionImage = async (fileLink) => {
    const uploadResult = await cloudinary.uploader.upload(fileLink, {
        resource_type: "image",
        type: "authenticated",
        folder: "meditrust/prescriptions",
    });
    return uploadResult;
};

// Per-request signed delivery URL for an authenticated asset.
// Verified offline against cloudinary@2.11.0: produces
// https://res.cloudinary.com/<cloud>/image/authenticated/s--<sig>--/<id>
export const getPrescriptionSignedUrl = (publicId) => {
    if (!publicId) return null;
    return cloudinary.url(publicId, {
        secure: true,
        sign_url: true,
        type: "authenticated",
        resource_type: "image",
    });
};


export default uploadToCloudinary