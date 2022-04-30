const express = require("express");
const controller = require("../controllers/auth");
const router = express.Router(); //создаём локальный роутер

//localhost:3500/api/auth/login
router.post("/login", controller.login);

//localhost:3500/api/auth/register
router.post("/register", controller.register);

module.exports = router;
