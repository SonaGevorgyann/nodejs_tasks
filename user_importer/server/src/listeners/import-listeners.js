const audit = require("../models/audit-state");
const auditModel = require("../models/audit.model");
const { buildAuditFileName } = require("../utils/audit-file-name");
const {
    logStarted,
    logAccepted,
    logSkipped,
    logSummary,
    logError,
    logAuditSaved
} = require("../utils/logger");

function markProcessAsFailed() {
    process.exitCode = 1;
}

function handleError(error) {
    logError(error);
    markProcessAsFailed();
}

function saveAudit(callback) {
    const timestamp = Date.now();
    const fileName = buildAuditFileName(timestamp);
    const auditData = audit.toData(timestamp);

    auditModel.save(fileName, auditData, callback);
}

function handleCompleted() {
    logSummary(audit.imported, audit.skipped);

    saveAudit((error, auditPath) => {
        if (error) {
            handleError(error);
            return;
        }

        logAuditSaved(auditPath);
    });
}

function registerListeners(job) {
    job.on("started", logStarted);
    job.on("accepted", logAccepted);
    job.on("skipped", logSkipped);
    job.on("accepted", () => audit.incrementImported());
    job.on("skipped", () => audit.incrementSkipped());
    job.on("completed", handleCompleted);
    job.on("error", handleError);
}

module.exports = { registerListeners };