const express = require("express");
const connectToMongoDB = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url"); // <-- yahan import karna zaroori hai
const path = require("path");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = 8001;
app.use(express.json()); // JSON body ke liye
app.use(express.urlencoded({ extended: true })); // form data ke liye

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

app.use("/url", urlRoute);
app.use("/", staticRouter);

//get all
app.get("/test", async (req, res) => {
  const allUrls = await URL.find();
  return res.render("home", {
    urls: allUrls,
  });
});

// Redirect route
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
