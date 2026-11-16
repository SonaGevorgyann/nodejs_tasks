const { Router } = require("express");
const controller = require("../controllers/controller");

const router = Router();

router.get("/users", (req, res, next) => {
    controller.getUsers((error, users) => {
        if (error) {
            next(error);
            return;
        }

        res.json(users);
    });
});

router.get("/users/:id", (req, res, next) => {
    controller.getUserById(req.params.id, (error, user) => {
        if (error) {
            next(error);
            return;
        }

        res.json(user);
    });
});

router.get("/audits", (req, res, next) => {
    controller.getAudits((error, audits) => {
        if (error) {
            next(error);
            return;
        }

        res.json(audits);
    });
});

router.get("/audits/:fileName", (req, res, next) => {
    controller.getAudit(req.params.fileName, (error, audit) => {
        if (error) {
            next(error);
            return;
        }

        res.json(audit);
    });
});

router.post("/import", (req, res, next) => {
    controller.startImport((error) => {
        if (error) {
            next(error);
            return;
        }

        res.status(202).json({ message: "Import started" });
    });
});

module.exports = router;