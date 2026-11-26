const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { AppError } = require("../middlewares/error-handler");

const upload = require("../middlewares/upload");
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

router.post("/users/:id/picture", upload.single("picture"), (req, res, next) => {
    if (!req.file) {
        next(new AppError(400, "Picture is required"));
        return;
    }

    const picture = "/uploads/" + req.file.filename;

    userController.updateUserPicture(req.params.id, picture, (error, user) => {
        if (error) {
            next(error);
        } else {
            res.json(user);
        }
    });
});

module.exports = router;