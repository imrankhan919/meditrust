import mongoose from "mongoose";

const pathologyTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },


}, {
    timestamps: true
})


const PathologyTest = mongoose.model("PathologyTest", pathologyTestSchema)

export default PathologyTest