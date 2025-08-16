console.log("=".repeat(40), "Node Code By Hamza", "=".repeat(40));
console.log("=".repeat(40));

/**
 * Express Server Setup
 * --------------------
 * - Express server to handle CRUD operations for users.
 * - Users are stored in users.json.
 */

const express = require("express");
const fs = require("fs");
const { urlencoded } = require("body-parser");

const app = express();
const port = 8000;

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(urlencoded({ extended: false })); // For parsing form data

// Load users
const users = require("./users.json");

/* ==========================
   ROUTES
=========================== */

/**
 * GET all users (API)
 */
app.get("/api/users", (req, res) => {
  console.log(".".repeat(10), "Request received:", req.url);
  res.send(users);
});

/**
 * GET all users (Server-side rendering)
 */
app.get("/users", (req, res) => {
  console.log(".".repeat(10), "Request received (SSR):", req.url);

  const list = users.map((user) => `<li>${user.first_name}</li>`).join("");

  const html = `<ol style="background-color:red">${list}</ol>`;
  res.send(html);
});

/**
 * GET single user by ID
 */
app.get("/api/user/:id", (req, res) => {
  console.log(".".repeat(10), "Request received:", req.url);

  const userid = +req.params.id;
  const user = users.find((u) => u.id === userid);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.send(user);
});

/**
 * POST new user
 */
app.post("/api/submit", (req, res) => {
  console.log(".".repeat(10), "Request received:", req.url);
  console.log("Request body:", req.body);

  const { email, first_name } = req.body;

  if (!email || !first_name)
    return res.status(400).json({ error: "Please fill the form" });

  // Ensure unique ID
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    first_name,
    email,
  };

  users.push(newUser);

  fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({ error: "Failed to save user" });
    }
    console.log("Saved successfully");
    res.send(`User saved successfully with id: ${newUser.id}`);
  });
});

/**
 * DELETE user by ID
 */
app.delete("/api/user/:id", (req, res) => {
  const userId = +req.params.id;
  console.log("Request to delete user ID:", userId);

  const uindex = users.findIndex((u) => u.id === userId);
  if (uindex === -1)
    return res.status(404).json({ error: "User not exist", id: userId });

  users.splice(uindex, 1); // Remove the user

  fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to delete user" });
    res.status(200).json({ message: "User deleted", id: userId });
  });
});

/**
 * PUT update entire user by ID
 */
app.put("/api/user/:id", (req, res) => {
  console.log("PUT Request received:", req.url);

  const userid = +req.params.id;
  const userIndex = users.findIndex((u) => u.id === userid);

  if (userIndex === -1)
    return res.status(404).json({ error: "User not found", id: userid });

  users[userIndex] = { id: userid, ...req.body };

  fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
    if (err)
      return res.status(500).json({ error: "Update failed", id: userid });
    res
      .status(200)
      .json({ message: "User updated successfully", user: users[userIndex] });
  });
});

/**
 * PATCH update partial user by ID
 */
app.patch("/api/user/:id", (req, res) => {
  console.log("PATCH Request received:", req.url);

  const userid = +req.params.id;
  const userIndex = users.findIndex((u) => u.id === userid);

  if (userIndex === -1)
    return res.status(404).json({ error: "User not found", id: userid });

  users[userIndex] = { ...users[userIndex], ...req.body };

  fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
    if (err)
      return res.status(500).json({ error: "Update failed", id: userid });
    res
      .status(200)
      .json({ message: "User updated successfully", user: users[userIndex] });
  });
});

/* ==========================
   SERVER LISTEN
=========================== */
app.listen(port, () =>
  console.log(`Server is running at -> http://localhost:${port}`)
);
