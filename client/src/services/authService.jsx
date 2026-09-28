import axios from "axios"


const registerUser = async (formData) => {
    const response = await axios.post("/api/auth/register", formData)
    return response.data
}

const loginUser = async (formData) => {

    const response = await axios.post("/api/auth/login", formData)
    localStorage.setItem("user", JSON.stringify(response.data))
    return response.data

}


const authService = { registerUser, loginUser }


export default authService