import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"

dotenv.config()

import authRoutes from "./routes/authRoutes.js"



const PORT = process.env.PORT || 5000
const app = express()


// DB CONNECTION
connectDB()


// AUTH ROUTES
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})