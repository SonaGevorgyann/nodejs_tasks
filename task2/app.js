const path = require("path");
const findUserById = require("./findUserById");

const fileArg = process.argv[2];
const idArg = process.argv[3];

if (!fileArg || !idArg) {
  console.error("Usage: node app.js <file.json> <id>");
  process.exit(1);
}

const id = Number(idArg);

if (Number.isNaN(id)) {
  console.error("Error: id must be a number, got '" + idArg + "'");
  process.exit(1);
}

findUserById(path.resolve(fileArg), id, (err, user) => {
  if (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
  console.log(user.name);
});