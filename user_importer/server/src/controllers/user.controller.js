const userModel = require("../models/user.model");

function getUsers(callback) {
    userModel.readAll(callback);
}

function getUserById(id, callback) {
    userModel.readById(id, callback);
}

function deleteUser(id, callback) {
    userModel.deleteById(id, callback);
}

function updateUser(id, name, callback) {
    userModel.updateById(id, name, callback);
}

module.exports = { getUsers, getUserById, deleteUser, updateUser };