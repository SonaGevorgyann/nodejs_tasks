const { Router } = require("express");
const importController = require("../controllers/import.controller");

const router = Router();

router.post("/import", (req, res, next) => {
    importController.startImport((error) => {
        if (error) {
            next(error);
        } else {
            res.status(202).json({ message: "Import started" });
        }
    });
});

module.exports = router;