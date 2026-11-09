const fs = require("fs");

function readJson(filePath, callback) {
  fs.readFile(filePath, "utf8", (err, text) => {
    if (err) {
      return callback(err);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      return callback(parseError);
    }

    callback(null, data);
  });
}

module.exports = readJson;