const fs = require("fs");

function writeJson(filePath, data, callback) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (error) => {
        if (error) {
            callback(error);
            return;
        }
        callback(null);
    });
}

module.exports = writeJson;