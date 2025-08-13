const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/userController");
const { registerValidator } = require("../validators/userValidators");

router.post("/register", registerValidator, registerUser);

module.exports = router;
