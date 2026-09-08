import Pathologist from "../../models/pathologistModel.js"
import PathologyAppointment from "../../models/pathologyAppointment.js"
import PathologyTest from "../../models/pathologyTest.js"
import User from "../../models/userModel.js"

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

    const userId = req.user.id

    const user = await User.findById(userId)


    if (!user) {
        res.status(404)
        throw new Error("No User Found!")
    }

    if (user.userType !== "PATHOLOGIST") {
        res.status(401)
        throw new Error("You Are Not Pathologist")
    }

    const pathologist = await Pathologist.findOne({ user: user._id })


    const { title, description, price } = req.body

    if (!title || !description || !price) {
        res.status(409)
        throw new Error("Please Fill All Details!")
    }

    const pathologyTest = await PathologyTest.create({ pathologist: pathologist._id, title, description, price })

    if (!PathologyTest) {
        res.status(409)
        throw new Error("Pathology Test Not Added!")
    }


    res.status(201).json(pathologyTest)

}


const getAllAppointments = async (req, res) => {

    const userId = req.user.id

    const user = await User.findById(userId)


    if (!user) {
        res.status(404)
        throw new Error("No User Found!")
    }

    if (user.userType !== "PATHOLOGIST") {
        res.status(401)
        throw new Error("You Are Not Pathologist")
    }

    const pathologist = await Pathologist.findOne({ user: user._id })
    const appointments = await PathologyAppointment.find({ pathologist: pathologist._id })

    if (!appointments) {
        res.status(404)
        throw new Error("No Appointment Found!")
    }

    res.status(200).json(appointments)

}


const updateAppointment = async (req, res) => {
    const appointmentId = req.params.aid

    const appointment = await PathologyAppointment.findById(appointmentId)

    if (!appointment) {
        res.status(404)
        throw new Error("Appointment Does Not Exist")
    }

    const updatedAppointment = await PathologyAppointment.findByIdAndUpdate(appointmentId, req.body, { new: true })

    if (!updatedAppointment) {
        res.status(409)
        throw new Error("Appointment Not Updated")
    }

    res.status(200).json(updatedAppointment)


}

const getAppointment = async (req, res) => {
    const appointmentId = req.params.aid
    const appointment = await PathologyAppointment.findById(appointmentId).populate('user').populate('pathologist').populate('pathologyTest')

    if (!appointment) {
        res.status(404)
        throw new Error("Appointment Does Not Exist")
    }

    res.status(200).json(appointment)

}



const getAllPathologyTests = async (req, res) => {

    const tests = await PathologyTest.find().populate('pathologist')

    if (!tests) {
        res.status(404)
        throw new Error("Test Does Not Exist")
    }

    res.status(200).json(tests)

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






const pathologistController = { becomePathologist, addPathologyTest, bookTest, getAllAppointments, updateAppointment, getAppointment, getAllPathologyTests }

export default pathologistController