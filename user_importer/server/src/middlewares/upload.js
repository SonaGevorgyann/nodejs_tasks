const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { paths } = require("../config");
const { AppError } = require("./error-handler");

// Make sure the uploads folder exists.
fs.mkdirSync(paths.uploadsDir, { recursive: true });

// Configure where and how uploaded files are stored.
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, paths.uploadsDir);
    },

    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const filename = Date.now() + extension;

        callback(null, filename);
    }
});

// Accept only image files.
function fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
        callback(null, true);
        return;
    }

    callback(new AppError(400, "Only image files are allowed"));
}

// Configure Multer.
const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

module.exports = upload;