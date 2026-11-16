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
    },

    reset() {
    this.imported = 0;
    this.skipped = 0;
}
};

module.exports = audit;