import mongoose from "mongoose";

const doctorAppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    status: {
        type: String,
        enums: ["pending", "delivered", "cancelled"],
        default: "pending"
    }
}, {
    timestamps: true
})

const DoctorAppointment = mongoose.model("DoctorAppointment", doctorAppointmentSchema)

export default DoctorAppointment