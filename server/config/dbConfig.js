import mongoose from "mongoose"

const connectDB = async () => {
    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCCESS : ${conn.connection.name}`.bgGreen.black)

    } catch (error) {
        console.log(`DB CONNECTION FAILED : ${error.message}`.bgRed)
    }
}


export default connectDB