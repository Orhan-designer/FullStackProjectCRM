const express = require("express");
const controller = require("../controllers/analytic");
const router = express.Router(); //создаём локальный роутер

router.get("/overview", controller.overview);
router.get("/analytics", controller.analytic);

module.exports = router;
