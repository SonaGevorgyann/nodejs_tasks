const readJson = require("../utils/read-json");
const writeJson = require("../utils/write-json");
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

function deleteById(id, callback) {
    readAll((error, users) => {
        if (error) {
            callback(error);
            return;
        }

        const index = users.findIndex((item) => String(item.id) === String(id));

        if (index === -1) {
            callback(new AppError(404, "User not found"));
            return;
        }

        users.splice(index, 1);

        writeJson(paths.directoryFile, users, (writeError) => {
            if (writeError) {
                callback(writeError);
                return;
            }

            callback(null);
        });
    });
}


function updateById(id, name, callback) {
    if (typeof name !== "string" || !name.trim()) {
        callback(new AppError(400, "Name is required"));
        return;
    }

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

        user.name = name.trim();

        writeJson(paths.directoryFile, users, (writeError) => {
            if(writeError) {
                callback(writeError);
                return;
            }
            callback(null, user);
        });
    })
}

module.exports = { readAll, readById, deleteById, updateById };