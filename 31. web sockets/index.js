const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

// Serve static files from public directory
app.use(express.static(path.resolve("./public")));

// Serve main page
app.get("/", (req, res) => {
  res.sendFile(path.resolve("./public/index.html"));
});

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server);

// Handle socket connections
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Listen for messages from client
  socket.on("user-message", (message) => {
    console.log("Message received:", message);
    // Broadcast message to all connected clients
    io.emit("message", message);
  });
});

// Start server
server.listen(9000, () => {
  console.log("Server started at port 9000");
});
