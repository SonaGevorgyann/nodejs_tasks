const ImportJob = require("./import-job");
const audit = require("./audit");

const [, , inputPath, outputPath] = process.argv;

const job = new ImportJob(inputPath, outputPath);

job.on("started", () => {
    console.log("Import started");
});

job.on("accepted", (record) => {
    console.log("Accepted:", record);
});

job.on("skipped", (record, reason) => {
    console.log("Skipped:", record, "-", reason);
});

job.on("accepted", () => {
    audit.imported++;
});

job.on("skipped", () => {
    audit.skipped++;
});

job.on("completed", () => {
    console.log(`Imported ${audit.imported}, skipped ${audit.skipped}`);
});

job.on("error", (error) => {
    console.error("Import failed:", error.message);
    process.exitCode = 1;
});

console.log("Before job.start()");

job.start();

console.log("After job.start()");