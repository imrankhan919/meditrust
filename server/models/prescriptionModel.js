import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: null,
            trim: true,
        },
        strength: {
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
        instructions: {
            type: String,
            default: null,
            trim: true,
        },
        notes: {
            type: String,
            default: null,
            trim: true,
        },
        confidence: {
            type: Number,
            default: null,
            min: 0,
            max: 1,
        },
        needsReview: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const PrescriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        patient_name: {
            type: String,
            trim: true,
            default: null,
        },
        doctor_name: {
            type: String,
            trim: true,
            default: null,
        },
        clinic_name: {
            type: String,
            trim: true,
            default: null,
        },
        date: {
            // stored as string since the source format (DD/MM/YYYY) is ambiguous/OCR-derived;
            // parse to a real Date at the application layer if you need date queries
            type: String,
            trim: true,
            default: null,
        },
        medicines: {
            type: [MedicineSchema],
            default: [],
        },
        diagnosis_notes: {
            type: String,
            trim: true,
            default: null,
        },
        additional_instructions: {
            type: [String],
            default: [],
        },
        unreadable_text: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["uploaded", "processing", "needs_review", "confirmed", "failed"],
            default: "needs_review",
            index: true,
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
        confirmedAt: {
            type: Date,
            default: null,
        },
        image: {
            type: String, // Legacy public Cloudinary URL (kept for backward compat)
            trim: true,
            default: null,
        },
        imagePublicId: {
            type: String, // Cloudinary public_id for new private/authenticated uploads
            trim: true,
            default: null,
            select: false,
        },
        imageAccess: {
            type: String,
            enum: ["public_legacy", "authenticated"],
            default: "public_legacy",
        },
    },
    { timestamps: true }
);

PrescriptionSchema.index({ user: 1, createdAt: -1 });

const Prescription = mongoose.model('Prescription', PrescriptionSchema);

export default Prescription
