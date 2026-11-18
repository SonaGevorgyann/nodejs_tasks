const readJson = require("../utils/read-json");
const { paths } = require("../config");
const { AppError } = require("../middlewares/error-handler");

function readAll(callback) {
    readJson(paths.directoryFile, callback);
}

function readById(id, callback) {
    readAll((error, users) => {
        if (error) {
            callback(error);
            return;
        }

        const user = users.find((item) => String(item.id) === String(id));

        if (!user) {
            callback(new AppError(404, "User not found"));
            return;
        }

        callback(null, user);
    });
}

module.exports = { readAll, readById };