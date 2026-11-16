const directoryModel = require("../models/directory.model");
const auditModel = require("../models/audit.model");
const { isAuditFileName, extractTimestamp } = require("../utils/audit-file-name");
const { runImport } = require("../services/import-service");

function getUsers(callback) {
    directoryModel.readAll(callback);
}

function getUserById(id, callback) {
    directoryModel.readAll((error, users) => {
        if (error) {
            callback(error);
            return;
        }

        const user = users.find((item) => String(item.id) === String(id));

        if (!user) {
            const notFoundError = new Error("User not found");
            notFoundError.status = 404;
            callback(notFoundError);
            return;
        }

        callback(null, user);
    });
}

function getAudits(callback) {
    auditModel.listFileNames((error, fileNames) => {
        if (error) {
            callback(error);
            return;
        }

        const audits = fileNames
            .filter(isAuditFileName)
            .map((fileName) => ({ fileName, timestamp: extractTimestamp(fileName) }));

        callback(null, audits);
    });
}

function getAudit(fileName, callback) {
    if (!isAuditFileName(fileName)) {
        const error = new Error("Invalid audit file name");
        error.status = 400;
        callback(error);
        return;
    }

    auditModel.readByFileName(fileName, callback);
}

function startImport(callback) {
    runImport();
    callback(null);
}

module.exports = { getUsers, getUserById, getAudits, getAudit, startImport };