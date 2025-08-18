const express = require("express");
const URL = require("../models/url");
const router = express.Router();

// Home page route
router.get("/", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

// Handle URL creation
router.post("/url", async (req, res) => {
  const { url } = req.body;

  // Create short URL logic here
  const shortUrl = await URL.create({
    shortId: generateShortId(),
    redirectURL: url,
    visitHistory: [],
  });

  const allUrls = await URL.find({});
  return res.render("home", {
    id: shortUrl.shortId,
    urls: allUrls,
  });
});

module.exports = router;
