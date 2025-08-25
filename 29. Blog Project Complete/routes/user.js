const { userSignin, userSignup } = require("../controllers/user");
const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Hello from X route");
// });
// Render signin form
router.get("/signin", (req, res) => {
  res.render("signin");
});

// Render signup form
router.get("/signup", (req, res) => {
  res.render("signup");
});
// router logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.render("signin");
});

// POST signin
router.post("/signin", userSignin);

// Handle signup form
router.post("/signup", userSignup);

module.exports = router;
