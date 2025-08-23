const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname; // unique filename
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("profileimg"), (req, res) => {
  console.log(req.body); // Form text data
  console.log(req.file); // Uploaded file information

  res.redirect("/"); // Redirect back to home page
});

const port = 8000;

app.listen(port, () => console.log(`server running on: `, `localhost:${port}`));
