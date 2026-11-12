const EventEmitter = require("events");
const fs = require("fs");
const readJson = require("../utils/read-json");
const { validateRecord } = require("../validators/validation");

class ImportJob extends EventEmitter {
    #seenIds = new Set();

    constructor(inputPath, outputPath) {
        super();

        this.inputPath = inputPath;
        this.outputPath = outputPath;
    }

    start() {
        this.emit("started");

        this.#readRecords((error, records) => {
            if (error) {
                this.emit("error", error);
                return;
            }

            const accepted = this.#processRecords(records);

            this.#writeRecords(accepted, (writeError) => {
                if (writeError) {
                    this.emit("error", writeError);
                    return;
                }

                this.emit("completed");
            });
        });
    }

    #readRecords(callback) {
        readJson(this.inputPath, (error, records) => {
            if (error) {
                callback(error);
                return;
            }

            if (!Array.isArray(records)) {
                callback(new Error("Input JSON must be an array"));
                return;
            }

            callback(null, records);
        });
    }

    #processRecords(records) {
        const accepted = [];

        for (const record of records) {
            const rejectionReason = this.#findRejectionReason(record);

            if (rejectionReason) {
                this.emit("skipped", record, rejectionReason);
                continue;
            }

            const acceptedRecord = this.#accept(record);

            accepted.push(acceptedRecord);
            this.emit("accepted", acceptedRecord);
        }

        return accepted;
    }

    #findRejectionReason(record) {
        const result = validateRecord(record);

        if (!result.valid) return result.reason;
        if (this.#seenIds.has(record.id)) return "Duplicate ID";

        return null;
    }

    #accept(record) {
        this.#seenIds.add(record.id);

        return this.#addTimestamp(record);
    }

    #addTimestamp(record) {
        return { ...record, timestamp: Date.now() };
    }

    #writeRecords(records, callback) {
        fs.writeFile(this.outputPath, JSON.stringify(records, null, 2), "utf8", callback);
    }
}

module.exports = ImportJob;