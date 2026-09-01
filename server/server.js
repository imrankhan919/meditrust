import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"

dotenv.config()

import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import errorHandler from "./middleware/errorHandler.js";



const PORT = process.env.PORT || 5000
const app = express()


// DB CONNECTION
connectDB()


// Body-Parser
app.use(express.json())
app.use(express.urlencoded())


// AUTH ROUTES
app.use("/api/auth", authRoutes)

// ADMIN ROUTES
app.use("/api/admin", adminRoutes)

// A.I Routes
app.use("/api/ai", aiRoutes)

// Error Handler
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})