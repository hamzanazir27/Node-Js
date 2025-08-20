const express = require("express");
const router = express.Router();
const { handlUserSignUp, handlUserLogin } = require("../controllers/user");

router.post("/", handlUserSignUp);
router.post("/login", handlUserLogin);
module.exports = router;
