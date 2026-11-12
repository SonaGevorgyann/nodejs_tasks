const fs = require("fs");
const path = require("path");
const readJson = require("../utils/read-json");
const { paths } = require("../config");

function buildFilePath(fileName) {
    return path.join(paths.auditsDir, fileName);
}

function listFileNames(callback) {
    fs.readdir(paths.auditsDir, callback);
}

function readByFileName(fileName, callback) {
    readJson(buildFilePath(fileName), callback);
}

function ensureAuditsDir(callback) {
    fs.mkdir(paths.auditsDir, { recursive: true }, (error) => callback(error));
}

function writeAuditFile(fileName, auditData, callback) {
    const filePath = buildFilePath(fileName);

    fs.writeFile(filePath, JSON.stringify(auditData, null, 2), (error) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, filePath);
    });
}

function save(fileName, auditData, callback) {
    ensureAuditsDir((error) => {
        if (error) {
            callback(error);
            return;
        }

        writeAuditFile(fileName, auditData, callback);
    });
}

module.exports = { listFileNames, readByFileName, save };