const fs = require("fs");

function parseJson(text, callback) {
    let data;

    try {
        data = JSON.parse(text);
    } catch (error) {
        callback(error);
        return;
    }

    callback(null, data);
}

function readJson(filePath, callback) {
    fs.readFile(filePath, "utf8", (error, text) => {
        if (error) {
            callback(error);
            return;
        }

        parseJson(text, callback);
    });
}

module.exports = readJson;