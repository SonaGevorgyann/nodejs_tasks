const readJson = require("../utils/read-json");
const writeJson = require("../utils/write-json");
const { paths } = require("../config");
const { AppError } = require("../middlewares/error-handler");
const {removeFile} = require("../utils/file-helper");

function readAll(callback) {
    readJson(paths.directoryFile, callback);
}

function readById(id, callback) {
    readAll((error, users) => {
        if (error) {
            callback(error);
        } else {
            const user = users.find((item) => String(item.id) === String(id));

            if (!user) {
                callback(new AppError(404, "User not found"));
            } else {
                callback(null, user);
            }
        }
    });
}

function deleteById(id, callback) {
    readAll((error, users) => {
        if (error) {
            callback(error);
        } else {
            const index = users.findIndex((item) => String(item.id) === String(id));

            if (index === -1) {
                callback(new AppError(404, "User not found"));
            } else {
                users.splice(index, 1);

                writeJson(paths.directoryFile, users, (writeError) => {
                    if (writeError) {
                        callback(writeError);
                    } else {
                        callback(null);
                    }
                });
            }
        }
    });
}

function updateById(id, name, callback) {
    if (typeof name !== "string" || !name.trim()) {
        callback(new AppError(400, "Name is required"));
    } else {
        readAll((error, users) => {
            if (error) {
                callback(error);
            } else {
                const user = users.find((item) => String(item.id) === String(id));

                if (!user) {
                    callback(new AppError(404, "User not found"));
                } else {
                    user.name = name.trim();

                    writeJson(paths.directoryFile, users, (writeError) => {
                        if (writeError) {
                            callback(writeError);
                        } else {
                            callback(null, user);
                        }
                    });
                }
            }
        });
    }
}


function updatePictureById(id, picture, callback) {
    readAll((error, users) => {
        if (error) {
            callback(error);
        } else {
            const user = users.find((item) => String(item.id) === String(id));

            if (!user) {
                callback(new AppError(404, "User not found"));
            } else {
                user.picture = picture;

                writeJson(paths.directoryFile, users, (writeError) => {
                    if (writeError) {
                        callback(writeError);
                    } else {
                        callback(null, user);
                    }
                });
            }
        }
    });
}


function deletePictureById(id, callback) {
    readAll((error, users) => {
        if(error) {
            callback(error);
        }
        else {
            const user = users.find((item) => String(item.id) === String(id));

            if (!user) {
                callback(new AppError(404, "User not found"));
            }
            else if (!user.picture) {
                callback(null, users);
            }
            else {
                const oldPicture = user.picture;
                 user.picture = null;

                writeJson(paths.directoryFile, users, (writeError) => {
                    if (writeError) {
                        callback(writeError);
                    } else {
                        removeFile(oldPicture, () => {
                            callback(null, user);
                        })
                    }
                });
            }
        }
    });
}

module.exports = { readAll, readById, deleteById, updateById, updatePictureById, deletePictureById };