console.log("==========node js file =========");

const exp = require("express");
const app2 = exp();
app2.use(exp.urlencoded({ extended: true })); // Form data

app2.get("/", (req, res) => {
  res.send({ hello: "from node js" });
});
app2.get("/about", (req, res) => {
  res.send("about sections");
});

app2.get("/submit/:id", (req, res) => {
  res.send(req.params.id);
});

app2.get("/query", (req, res) => {
  res.send(req.query.age);
});

app2.listen(8000, () => {
  console.log("server start    (listen file)");
});
// ## **6. Express Route Syntax**

// app.METHOD(PATH, HANDLER)

// - **METHOD**: HTTP method in lowercase (`get`, `post`, `put`, `patch`, `delete`)
// - **PATH**: URL path (string or pattern)
// - **HANDLER**: Function `(req, res) => {}` that handles the request.
