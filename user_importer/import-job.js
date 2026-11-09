const EventEmitter = require("events");
const fs = require("fs");
const readJson = require("./read-json");
const { validateRecord } = require("./validation");

class ImportJob extends EventEmitter {
    #seenIds = new Set();

    constructor(inputPath, outputPath) {
        super();

        this.inputPath = inputPath;
        this.outputPath = outputPath;
    }

    start() {
        this.emit("started");

        readJson(this.inputPath, (error, records) => {
            if (error) {
                this.emit("error", error);
                return;
            }

            if (!Array.isArray(records)) {
                this.emit("error", new Error("Input JSON must be an array"));
                return;
            }

            const accepted = [];

            for (const record of records) {
                const result = validateRecord(record);

                if (!result.valid) {
                    this.emit("skipped", record, result.reason);
                    continue;
                }

                if (this.#seenIds.has(record.id)) {
                    this.emit("skipped", record, "Duplicate ID");
                    continue;
                }

                this.#seenIds.add(record.id);
                accepted.push(record);

                this.emit("accepted", record);
            }

            fs.writeFile(
                this.outputPath,
                JSON.stringify(accepted, null, 2),
                "utf8",
                (error) => {
                    if (error) {
                        this.emit("error", error);
                        return;
                    }

                    this.emit("completed");
                }
            );
        });
    }
}

module.exports = ImportJob;