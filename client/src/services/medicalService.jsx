import axios from "axios"


const fetchData = async () => {
    const responseForMedicines = await axios.get("/api/products")
    const responseForDoctors = await axios.get("/api/doctor")
    const responseForPathologists = await axios.get("/api/pathologist")
    const responseForTests = await axios.get("/api/pathologist/tests")
    let medicines = responseForMedicines.data.sort((a, b) => a.stock - b.stock).splice(4)
    let doctors = responseForDoctors.data
    let pathologists = responseForPathologists.data
    let tests = responseForTests.data
    return {
        medicines: medicines,
        doctors: doctors,
        pathologists: pathologists,
        tests: tests
    }

}

const medicalService = { fetchData }

export default medicalService