const { Router } = require("express");
const controller = require("../controllers/controller");

const router = Router();

router.get("/users", controller.getUsers);
router.get("/audits", controller.getAudits);
router.get("/audits/:fileName", controller.getAudit);

module.exports = router;