const { Router } = require("express");
const userRoutes = require("./user.routes");
const auditRoutes = require("./audit.routes");
const importRoutes = require("./import.routes");

const router = Router();

router.use(userRoutes);
router.use(auditRoutes);
router.use(importRoutes);

module.exports = router;