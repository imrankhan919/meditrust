const explainPrescription = async (req, res) => {

    console.log(req.file)

    res.send("Prescription Explained!")
}


const aiController = {
    explainPrescription
}

export default aiController