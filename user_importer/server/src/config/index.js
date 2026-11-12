const path = require("path");

const serverRoot = path.join(__dirname, "..", "..");

module.exports = {
    port: process.env.PORT || 3000,
    paths: {
        directoryFile: path.join(serverRoot, "output", "directory.json"),
        auditsDir: path.join(serverRoot, "output", "audits")
    }
};