const directoryModel = require("../models/directory.model");
const auditModel = require("../models/audit.model");
const { isAuditFileName, extractTimestamp } = require("../utils/audit-file-name");

function sendError(res, error) {
    console.error(error);

    if (error.code === "ENOENT") {
        res.status(404).json({ error: "Not found" });
        return;
    }

    res.status(500).json({ error: "Server error" });
}

function toAuditSummary(fileName) {
    if (!isAuditFileName(fileName)) {
        throw new Error(`Not an audit file: ${fileName}`);
    }

    return { fileName, timestamp: extractTimestamp(fileName) };
}

function getUsers(req, res) {
    directoryModel.readAll((error, users) => {
        if (error) {
            sendError(res, error);
            return;
        }

        res.json(users);
    });
}

function getAudits(req, res) {
    auditModel.listFileNames((error, fileNames) => {
        if (error) {
            sendError(res, error);
            return;
        }

        try {
            res.json(fileNames.map(toAuditSummary));
        } catch (summaryError) {
            sendError(res, summaryError);
        }
    });
}

function getAudit(req, res) {
    auditModel.readByFileName(req.params.fileName, (error, audit) => {
        if (error) {
            sendError(res, error);
            return;
        }

        res.json(audit);
    });
}

module.exports = { getUsers, getAudits, getAudit };