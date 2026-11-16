function errorHandler(error, req, res, next) {
    console.error(error);

    if (error.code === "ENOENT") {
        res.status(404).json({ error: "Not found" });
        return;
    }

    if (error.status) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    res.status(500).json({ error: "Server error" });
}

module.exports = errorHandler;