import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
            trim: true,
        },
        dosage: {
            type: String,
            default: null,
            trim: true,
        },
        frequency: {
            type: String,
            default: null,
            trim: true,
        },
        duration: {
            type: String,
            default: null,
            trim: true,
        },
        notes: {
            type: String,
            default: null,
            trim: true,
        },
    },
    { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        patient_name: {
            type: String,
            trim: true,
        },
        doctor_name: {
            type: String,
            trim: true,
        },
        date: {
            // stored as string since the source format (DD/MM/YYYY) is ambiguous/OCR-derived;
            // parse to a real Date at the application layer if you need date queries
            type: String,
            trim: true,
        },
        medicines: {
            type: [MedicineSchema],
            default: [],
        },
        diagnosis_notes: {
            type: String,
            trim: true,
        },
        image: {
            type: String, // Cloudinary URL of the source prescription image
            trim: true,
        },
    },
    { timestamps: true }
);

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

export default Prescription