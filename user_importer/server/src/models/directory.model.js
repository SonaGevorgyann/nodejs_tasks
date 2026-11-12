const readJson = require("../utils/read-json");
const { paths } = require("../config");

function readAll(callback) {
    readJson(paths.directoryFile, callback);
}

module.exports = { readAll };