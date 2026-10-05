import axios from "axios"

const fetchAllAdminData = async (payload) => {

    const options = {
        headers: {
            authorization: `Bearer ${payload}`
        }
    }

    const responseForUsers = await axios.get("/api/admin/users", options)
    const responseForProducts = await axios.get("/api/admin/products", options)
    const responseForPathologists = await axios.get("/api/admin/pathologists", options)
    const responseForOrders = await axios.get("/api/admin/orders", options)
    const responseForDoctors = await axios.get("/api/admin/doctors", options)

    const data = {
        users: responseForUsers.data,
        products: responseForProducts.data,
        pathologists: responseForPathologists.data,
        orders: responseForOrders.data,
        doctors: responseForDoctors.data
    }



    return data

}


const adminService = {
    fetchAllAdminData
}


export default adminService