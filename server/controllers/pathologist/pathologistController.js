import Pathologist from "../../models/pathologistModel.js"

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



const pathologistController = { becomePathologist }

export default pathologistController