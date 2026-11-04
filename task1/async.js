const fs = require("fs");
const path = require("path");

console.log("Start");

fs.readFile(path.join(__dirname, "sample.txt"), "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

console.log("End");