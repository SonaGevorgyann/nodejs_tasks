const auditModel = require("../models/audit.model");

function getAudits(callback) {
    auditModel.readAll(callback);
}

function getAudit(fileName, callback) {
    auditModel.readByFileName(fileName, callback);
}

module.exports = { getAudits, getAudit };