import Pathologist from "../../models/pathologistModel.js"
import PathologyAppointment from "../../models/pathologyAppointment.js"
import PathologyTest from "../../models/pathologyTest.js"

const becomePathologist = async (req, res) => {

    let userId = req.user.id


    const { laboratoryName, laboratoryAddress, qualification, registrationNumber, experience, specialization, phone, email, consultationFee, workingHours, availableDays } = req.body

    console.log(req.body)

    if (!laboratoryName || !laboratoryAddress || !qualification || !registrationNumber || !experience || !specialization || !phone || !email || !consultationFee || !workingHours || !availableDays) {
        res.status(409)
        throw new Error("Please Fill All Details!!")
    }

    const newPathologist = await Pathologist.create({ user: userId, laboratoryName, laboratoryAddress, qualification, registrationNumber, experience, specialization, phone, email, consultationFee, workingHours, availableDays })

    if (!newPathologist) {
        res.status(409)
        throw new Error("Pathologist Not Created!")
    }

    res.status(201).json(newPathologist)


}



const addPathologyTest = async (req, res) => {

    const { title, description, price } = req.body

    if (!title || !description || !price) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    const pathologyTest = await PathologyTest.create({ title, description, price })

    if (!PathologyTest) {
        res.status(409)
        throw new Error("Pathology Test Not Added!")
    }


    res.status(201).json(pathologyTest)


}


const bookTest = async (req, res) => {

    const userId = req.user.id
    const pid = req.params.pid
    const { pathologyTest } = req.body

    if (!pathologyTest) {
        res.status(409)
        throw new Error("Add PathologyTest")
    }

    const testBooking = new PathologyAppointment({ user: userId, pathologist: pid, pathologyTest: pathologyTest })

    await testBooking.save()
    await testBooking.populate("user")
    await testBooking.populate('pathologist')
    await testBooking.populate('pathologyTest')

    if (!testBooking) {
        res.status(409)
        throw new Error("Patholgy Test Not Booked!")
    }

    res.status(201).json(testBooking)

}






const pathologistController = { becomePathologist, addPathologyTest, bookTest }

export default pathologistController