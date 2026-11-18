
const { runImport } = require("../services/import-service");


function startImport(callback) {
    runImport();
    callback(null);
}

module.exports = {  startImport };