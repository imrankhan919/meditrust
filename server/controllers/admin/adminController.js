import Product from "../../models/productModel.js"
import User from "../../models/userModel.js"

const getAllUsers = async (req, res) => {
    const users = await User.find()

    if (!users) {
        res.status(404)
        throw new Error("Users Not Found!")
    }

    res.status(200).json(users)

}


const getAllProducts = async (req, res) => {
    const products = await Product.find()

    if (!products) {
        res.status(404)
        throw new Error("Products Not Found!")
    }

    res.status(200).json(products)

}






const adminService = {
    getAllUsers,
    getAllProducts
}

export default adminService