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

const getMyProfile = async (payload) => {
    let token = payload.queryKey[1]
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get("/api/auth/me", options)
    return response.data

}


const updateProfile = async (payload) => {

    let options = {
        headers: {
            authorization: `Bearer ${payload.token}`
        }
    }

    const response = await axios.put("/api/auth/me", payload, options)
    console.log(response)
    return response.data


}



const authService = { registerUser, loginUser, getMyProfile, updateProfile }


export default authService