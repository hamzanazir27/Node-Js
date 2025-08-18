const mongoose = require("mongoose");

// Function to connect to MongoDB
function connectMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = { connectMongoDB };
