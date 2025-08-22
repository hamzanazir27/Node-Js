const shortid = require("shortid");
const URLModel = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    if (!body.url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Basic URL validation
    try {
      new URL(body.url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const shortID = shortid();

    const newURL = await URLModel.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.render("home", { id: shortID });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    if (!shortId) {
      return res.status(400).json({ error: "Short ID is required" });
    }

    const result = await URLModel.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
      originalURL: result.redirectURL,
      createdAt: result.createdAt,
    });
  } catch (error) {
    console.error("Error getting analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
