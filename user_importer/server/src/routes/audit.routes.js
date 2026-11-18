const { Router } = require("express");
const auditController = require("../controllers/audit.controller");

const router = Router();


router.get("/audits", (req, res, next) => {
    auditController.getAudits((error, audits) => {
        if (error) {
            next(error);
            return;
        }

        res.json(audits);
    });
});

router.get("/audits/:fileName", (req, res, next) => {
    auditController.getAudit(req.params.fileName, (error, audit) => {
        if (error) {
            next(error);
            return;
        }

        res.json(audit);
    });
});

module.exports = router;