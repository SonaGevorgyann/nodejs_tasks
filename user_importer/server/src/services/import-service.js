const ImportJob = require("../jobs/import-job");
const audit = require("../models/audit-state");
const { registerListeners } = require("../utils/import-listeners");
const { paths } = require("../config");

function runImport() {
    audit.reset();

    const job = new ImportJob(paths.importInputFile, paths.importOutputFile);

    registerListeners(job);
    job.start();
}

module.exports = { runImport };