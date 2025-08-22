const express = require("express");
const URLModel = require("../models/url");
const shortid = require("shortid");
const router = express.Router();

// Home page route
router.get("/", async (req, res) => {
  const userId = req?.user?._id;
  if (!userId) return res.redirect("/login");

  let allUrls;
  if (req.user.role == "admin") allUrls = await URLModel.find();
  else allUrls = await URLModel.find({ createdBy: userId });

  return res.render("home", {
    urls: allUrls,
  });
});

// Render SignUp
router.get("/signup", async (req, res) => {
  return res.render("signup");
});

//Render Login
router.get("/login", async (req, res) => {
  return res.render("login");
});

// Handle URL creation
router.post("/url", async (req, res) => {
  const { url } = req.body;

  // Create short URL logic here
  const shortUrl = await URLModel.create({
    shortId: shortid(),
    redirectURL: url,
    visitHistory: [],
  });

  const allUrls = await URLModel.find({});
  return res.render("home", {
    id: shortUrl.shortId,
    urls: allUrls,
  });
});

module.exports = router;
