import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../../models/userModel.js"

const registerUser = async (req, res) => {

    // Check if all fileds are coming
    const { name, email, phone, password } = req.body

    if (!name || !email || !phone || !password) {
        res.status(409)
        throw new Error("Please fill all details!!!")
    }


    // Check if user exist
    const emailExist = await User.findOne({ email })
    const phoneExist = await User.findOne({ phone })


    if (emailExist || phoneExist) {
        res.status(409)
        throw new Error("User Already Exists!")
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({ name, email, phone, password: hashedPassword })

    if (!user) {
        res.status(409)
        throw new Error("User Not Registered!")
    }


    res.status(201).json({
        message: "Account Succesfully Has Been Created!"
    })
}

const loginUser = async (req, res) => {

    // Check if all fileds are coming
    const { email, password } = req.body

    if (!email || !password) {
        res.status(409)
        throw new Error("Please fill all details!!!")
    }

    // Check if user exists
    const user = await User.findOne({ email })

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            name: user.name,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Invalid Credentials")
    }

}


const getMyProfile = async (req, res) => {
    res.status(200).json(req.user)
}


const updateProfile = async (req, res) => {

    const { userType } = req.body

    if (userType) {
        res.status(401)
        throw new Error("Only Admin Can Change User Type!!!")
    }

    let user = await User.findById(req.user.id)

    if (!user) {
        res.status(404)
        throw new Error("No User Found!")
    }

    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true })

    if (!updatedUser) {
        res.status(409)
        throw new Error("User Not Updated!")
    }

    res.status(200).json(updatedUser)
}






const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10d' })
}



const authService = {
    registerUser,
    loginUser,
    getMyProfile,
    updateProfile
}

export default authService