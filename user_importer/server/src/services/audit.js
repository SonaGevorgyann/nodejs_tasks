const audit = {
    imported: 0,
    skipped: 0,

    incrementImported() {
        this.imported++;
    },

    incrementSkipped() {
        this.skipped++;
    },

    toData(timestamp) {
        return { timestamp, imported: this.imported, skipped: this.skipped };
    }
};

module.exports = audit;