import jwt from "jsonwebtoken"
import User from "../models/userModel.js"


const protect = async (req, res, next) => {

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(" ")[1]
            let decoded = jwt.verify(token, process.env.JWT_SECRET)
            let user = await User.findById(decoded.id)

            if (!user) {
                res.status(404)
                throw new Error("Invalid User!")
            }

            // Added user to req object
            req.user = user
            next()
        } else {
            throw new Error("No Token Found!")
        }
    } catch (error) {
        res.status(401)
        throw new Error(error.message)
    }



}


export default protect