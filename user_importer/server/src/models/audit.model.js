const fs = require("fs");
const path = require("path");
const readJson = require("../utils/read-json");
const { paths } = require("../config");
const { isAuditFileName, extractTimestamp } = require("../utils/audit-file-name");
const { AppError } = require("../middlewares/error-handler");

function buildFilePath(fileName) {
    return path.join(paths.auditsDir, fileName);
}

function toAuditSummary(fileName) {
    return { fileName, timestamp: extractTimestamp(fileName) };
}

function listFileNames(callback) {
    fs.readdir(paths.auditsDir, callback);
}

function readAll(callback) {
    listFileNames((error, fileNames) => {
        if (error) {
            callback(error);
            return;
        }

        const audits = fileNames
            .filter(isAuditFileName)
            .map(toAuditSummary);

        callback(null, audits);
    });
}

function readByFileName(fileName, callback) {
    if (!isAuditFileName(fileName)) {
        callback(new AppError(400, "Invalid audit file name"));
        return;
    }

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

module.exports = { readAll, readByFileName, save };