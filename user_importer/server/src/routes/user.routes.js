const { Router } = require("express");
const userController = require("../controllers/user.controller");

const router = Router();

router.get("/users", (req, res, next) => {
    userController.getUsers((error, users) => {
        if (error) {
            next(error);
        }
        else {
            res.json(users);
        }
    });
});

router.get("/users/:id", (req, res, next) => {
    userController.getUserById(req.params.id, (error, user) => {
        if (error) {
            next(error);
        }
        else {
            res.json(user);
        }
    });
});

router.delete("/users/:id", (req, res, next) => {
    userController.deleteUser(req.params.id, (error) => {
        if (error) {
            next(error);
        }
        else {
            res.status(204).end();
        }
    });
});

router.put("/users/:id", (req, res, next) => {
    userController.updateUser(req.params.id, req.body.name, (error, user) => {
        if(error) {
            next(error);
        }
        else {
            res.json(user);
        }
    })

});

module.exports = router;