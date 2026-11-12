const ImportJob = require("./import-job");
const audit = require("./audit");
const auditModel = require("../models/audit.model");
const { buildAuditFileName } = require("../utils/audit-file-name");

function readArguments(argv) {
    const [, , inputPath, outputPath] = argv;

    return { inputPath, outputPath };
}

function hasAllArguments({ inputPath, outputPath }) {
    return Boolean(inputPath && outputPath);
}

function printUsage() {
    console.error("Usage: node src/services/import-users.js <inputPath> <outputPath>");
}

function logStarted() {
    console.log("Import started");
}

function logAccepted(record) {
    console.log("EVENT: Accepted:", record);
}

function logSkipped(record, reason) {
    console.log("EVENT: Skipped:", record, "-", reason);
}

function logSummary() {
    console.log(`Imported ${audit.imported}, skipped ${audit.skipped}`);
}

function logError(error) {
    console.error("Import failed:", error.message);
}

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
    logSummary();

    saveAudit((error, auditPath) => {
        if (error) {
            handleError(error);
            return;
        }

        console.log("Audit saved:", auditPath);
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

function main() {
    const args = readArguments(process.argv);

    if (!hasAllArguments(args)) {
        printUsage();
        markProcessAsFailed();
        return;
    }

    const job = new ImportJob(args.inputPath, args.outputPath);

    registerListeners(job);
    job.start();
}

main();