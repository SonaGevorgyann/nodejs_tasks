const { Router } = require("express");
const userController = require("../controllers/user.controller");

const router = Router();

router.get("/users", (req, res, next) => {
    userController.getUsers((error, users) => {
        if (error) {
            next(error);
            return;
        }

        res.json(users);
    });
});

router.get("/users/:id", (req, res, next) => {
    userController.getUserById(req.params.id, (error, user) => {
        if (error) {
            next(error);
            return;
        }

        res.json(user);
    });
});

module.exports = router;