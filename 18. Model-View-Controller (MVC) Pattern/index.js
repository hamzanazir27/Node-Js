console.log(
  "=".repeat(40),
  "Node Code By Hamza (Model-View-Controller (MVC) Pattern)",
  "=".repeat(40)
);
const express = require("express");
const { connectMongoDB } = require("./config/connection");
const { logReqRes } = require("./middlewares");
const userRouter = require("./routes/user");

const app = express();
const PORT = 8000;

// Database connection
connectMongoDB("mongodb://localhost:27017/youtube")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logReqRes("log.txt"));

// Routes
app.use("/api/users", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
