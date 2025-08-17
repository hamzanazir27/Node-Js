console.log(
  "=".repeat(40),
  "Node Code By Hamza (Express Middleware)",
  "=".repeat(40)
);

console.log("=".repeat(40));
const { time } = require("console");
/*

const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("middle ware pas through");
  next();
});

app.get("/users", (req, res) => {
  console.log("request recived");
  res.send("hello from express middle ware ");
});

app.listen(8000, () => console.log("server start"));
*/
/*
Output
======================================== Node Code By Hamza (Express Middleware) ========================================
========================================
server start
middle ware pas through
request recived


*/

/*

const express = require("express");
const app = express();

//add data into request
app.use((req, res, next) => {
  req.username = "hamza08";
  console.log("middle ware pas through");
  next();
});

app.get("/users", (req, res) => {
  console.log("request recived :", req.url);
  console.log("username :", req.username);
  res.send("hello from express middle ware ");
});

app.listen(8000, () => console.log("server start"));
*/

/*
Output
------
======================================== Node Code By Hamza (Express Middleware) ========================================
========================================
server start
middle ware pas through
request recived : /users
username : hamza08


*/

const express = require("express");
const fs = require("fs");
const app = express();
//add data into request
app.use((req, res, next) => {
  console.log("middle 1 ware pas through");
  const data = `\ndate ${time.now()} request from ${req.url}`;
  fs.appendFile("./logfile.txt", data, (err) => {
    if (err) console.log("error during the apend file ", err);
    else console.log("data sucessfully saved");
  });
  next();
});

app.get("/users", (req, res) => {
  console.log("request recived :", req.url);
  res.send("hello from express middle ware ");
});

app.listen(8000, () => console.log("server start"));
