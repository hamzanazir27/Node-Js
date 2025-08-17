console.log(
  "=".repeat(40),
  "Node Code By Hamza (Express Middleware)",
  "=".repeat(40)
);

console.log("=".repeat(40));

const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("middle ware pas through");
  next();
});

app.get("/users", (req, res) => {
  res.setHeader("x-myname", "hamza");
  console.log("request recived");
  res.send("hello from express middle ware ");
});

app.listen(8000, () => console.log("server start"));
