console.log("........".repeat(10));
console.log("........".repeat(10));
console.log("-".repeat(30), " blog application ", "-".repeat(30));
console.log("........".repeat(10));
console.log("========".repeat(10));

///////////////////////////Index.js start//////////////////////////////////
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user");
const app = express();

const PORT = 8000;

mongoose
  .connect("mongodb://localhost:27017/bloggify")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.render("home");
});
app.listen(PORT, () => console.log(`server started at port: ${PORT}`));
