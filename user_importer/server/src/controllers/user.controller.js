const userModel = require("../models/user.model");

function getUsers(callback) {
    userModel.readAll(callback);
}

function getUserById(id, callback) {
    userModel.readById(id, callback);
}

module.exports = { getUsers, getUserById};