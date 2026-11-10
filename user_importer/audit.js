const fs = require("fs");
const path = require("path");

const audit = {
    imported: 0,
    skipped: 0,

    save() {
        const auditsDir = path.join(__dirname, "audits");

        fs.mkdirSync(auditsDir, { recursive: true });

        const timestamp = new Date().getTime();

        const auditData = {
            timestamp,
            imported: this.imported,
            skipped: this.skipped
        };

        const fileName = `${timestamp}-audit.json`;
        const filePath = path.join(auditsDir, fileName);

        fs.writeFileSync(
            filePath,
            JSON.stringify(auditData, null, 2)
        );

        return filePath;
    }
};

module.exports = audit;