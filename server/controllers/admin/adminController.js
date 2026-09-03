import fs from "node:fs"
import uploadToCloudinary from "../../middleware/cloudinaryMiddleware.js"
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


const addProduct = async (req, res) => {

    const { name, description, price, stock, expiresOn } = req.body

    if (!name || !description || !price || !stock || !expiresOn) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    // Upload Image To Cloudinary
    let imageURL = await uploadToCloudinary(req.file.path)
    fs.unlinkSync(req.file.path)

    console.log(imageURL)

    const product = await Product.create({
        name,
        description,
        price,
        stock,
        expiresOn,
        image: imageURL.secure_url
    })


    if (!product) {
        res.status(409)
        throw new Error("Product Not Created!")
    }



    res.status(201).json(product)


}


const updateProduct = async (req, res) => {

    const productId = req.params.pid

    const product = await Product.findById(productId)

    if (!product) {
        res.status(404)
        throw new Error("Product Not Found!")
    }


    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true })

    if (!updatedProduct) {
        res.status(409)
        throw new Error("Product Not Updated")
    }


    res.status(200).json(updatedProduct)

}




const adminService = {
    getAllUsers,
    getAllProducts,
    addProduct,
    updateProduct
}

export default adminService