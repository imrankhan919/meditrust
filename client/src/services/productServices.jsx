import axios from "axios"


const fetchProductsAndDoctors = async () => {
    const responseForMedicines = await axios.get("/api/products")
    const responseForDoctors = await axios.get("/api/doctor")
    let medicines = responseForMedicines.data.sort((a, b) => a.stock - b.stock).splice(4)
    let doctors = responseForDoctors.data
    return {
        medicines: medicines,
        doctors: doctors
    }

}

const productServices = { fetchProductsAndDoctors }

export default productServices