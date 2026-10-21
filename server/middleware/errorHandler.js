const errorHandler = (err, req, res, next) => {

    // Prefer explicit error status (e.g. upload validation, Multer limits).
    let statusCode = err?.statusCode || res.statusCode;
    if (err?.code === "LIMIT_FILE_SIZE") statusCode = 400;
    if (!statusCode || statusCode <= 200) statusCode = 500;

    // Multer file-size errors otherwise surface as cryptic codes.
    const message = err?.code === "LIMIT_FILE_SIZE"
        ? "File too large. Maximum prescription image size is 5MB."
        : err.message;

    res.status(statusCode)
    res.json({
        message,
        // Never leak stack traces outside development.
        stack: process.env.NODE_ENV === "development" ? err.stack : null
    })


}


export default errorHandler