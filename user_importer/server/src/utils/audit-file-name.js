const AUDIT_FILE_SUFFIX = "-audit.json";

function buildAuditFileName(timestamp) {
    return `${timestamp}${AUDIT_FILE_SUFFIX}`;
}

function isAuditFileName(fileName) {
    return typeof fileName === "string" && fileName.endsWith(AUDIT_FILE_SUFFIX);
}

function extractTimestamp(fileName) {
    return fileName.slice(0, -AUDIT_FILE_SUFFIX.length);
}

module.exports = { buildAuditFileName, isAuditFileName, extractTimestamp };