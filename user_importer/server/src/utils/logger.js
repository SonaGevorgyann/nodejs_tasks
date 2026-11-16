function logStarted() {
    console.log("Import started");
}

function logAccepted(record) {
    console.log("EVENT: Accepted:", record);
}

function logSkipped(record, reason) {
    console.log("EVENT: Skipped:", record, "-", reason);
}

function logSummary(imported, skipped) {
    console.log(`Imported ${imported}, skipped ${skipped}`);
}

function logError(error) {
    console.error("Import failed:", error.message);
}

function logAuditSaved(auditPath) {
    console.log("Audit saved:", auditPath);
}

module.exports = {
    logStarted,
    logAccepted,
    logSkipped,
    logSummary,
    logError,
    logAuditSaved
};