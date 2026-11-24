class AppError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function errorHandler(error, req, res, next) {
    console.error(error);

    if (error.code === "ENOENT") {
        res.status(404).json({ error: "Not found" });
    } else if (error.status) {
        res.status(error.status).json({ error: error.message });
    } else {
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = { errorHandler, AppError };