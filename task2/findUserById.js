const readJson = require("./readJson");

function findUserById(filePath, id, callback) {
  readJson(filePath, (err, data) => {
    if (err) {
      return callback(err);
    }

    if (!Array.isArray(data)) {
      return callback(new Error("JSON is not an array"));
    }

    const user = data.find((u) => u.id === id);

    if (!user) {
      return callback(new Error("User with id " + id + " not found"));
    }

    callback(null, user);
  });
}

module.exports = findUserById;