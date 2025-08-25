console.log("........".repeat(10));
console.log("........".repeat(10));
console.log("-".repeat(30), " blog application ", "-".repeat(30));
console.log("........".repeat(10));
console.log("========".repeat(10));

///////////////////////////Index.js start//////////////////////////////////
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/blog");
require("dotenv").config();

const {
  authenticztionForValidateUser,
} = require("./middlewares/authentication");
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(authenticztionForValidateUser("token"));
app.use("/user", userRoute);
app.use("/blog", upload.single("coverImage"), blogRoute);

app.use(express.static(path.resolve("./public")));
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

  res.render("home", {
    user: req?.user,
    blogs: allBlogs,
  });
});

app.listen(PORT, () => console.log(`server started at port: ${PORT}`));
