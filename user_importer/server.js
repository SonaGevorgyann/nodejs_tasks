const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    // Get the list of audit files
    if (req.url === "/api/audits") {
        const auditsDir = path.join(__dirname, "audits");

        fs.readdir(auditsDir, (err, files) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }

            const audits = files
                .filter(file => file.endsWith("-audit.json"))
                .map(file => ({
                    fileName: file,
                    timestamp: file.replace("-audit.json", "")
                }));

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(audits));
        });

        return;
    }

    // Serve index.html
    if (req.url === "/" || req.url === "/index.html") {
        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Could not load index.html");
                return;
            }

            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });

        return;
    }

    // Serve directory.json
    if (req.url === "/directory.json") {
        const filePath = path.join(__dirname, "directory.json");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("directory.json not found");
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(data);
        });

        return;
    }

    // Serve audit JSON files
    if (req.url.startsWith("/audits/")) {
        const fileName = path.basename(req.url);
        const filePath = path.join(__dirname, "audits", fileName);

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Audit not found");
                return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(data);
        });

        return;
    }

    res.writeHead(404);
    res.end("Not found");
});

server.listen(PORT, () => {
    console.log(`Dashboard running at http://localhost:${PORT}`);
});