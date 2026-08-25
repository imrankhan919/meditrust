const errorHandler = (err, req, res, next) => {

    let statusCode = res.statusCode <= 200 ? 500 : res.statusCode

    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })


}


export default errorHandler