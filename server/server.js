import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


import express from "express"
import dotenv from "dotenv"
import colors from "colors"
import connectDB from "./config/dbConfig.js"
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"

dotenv.config()

import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import aiRoutes from "./routes/aiRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import pathologistRoutes from "./routes/pathologistRoutes.js"
import doctorRoutes from "./routes/doctorRoutes.js"
import errorHandler from "./middleware/errorHandler.js";



const PORT = process.env.PORT || 5000
const app = express()


// DB CONNECTION
connectDB()


app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        credentials: true,
    })
);


// Body-Parser
app.use(express.json())
app.use(express.urlencoded())


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve React production build
const frontendPath = path.join(__dirname, "../client/dist");

app.use(express.static(frontendPath));

// AUTH ROUTES
app.use("/api/auth", authRoutes)

// ADMIN ROUTES
app.use("/api/admin", adminRoutes)

// A.I Routes
app.use("/api/ai", aiRoutes)

// Product Routes
app.use("/api/products", productRoutes)

// Pathologist Routes
app.use("/api/pathologist", pathologistRoutes)

// Doctor Routes
app.use("/api/doctor", doctorRoutes)


if (process.env.NODE_ENV === "production") {
    app.get("/{*path}", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });


} else {
    app.get("/{*path}", (req, res) => {
        res.send("Project is Running in Dev Enviroment For Frontend Go To PORT : 5173")
    });
}






// Error Handler
app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgBlue)
})