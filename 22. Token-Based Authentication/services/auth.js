// services/auth.js
const jwt = require("jsonwebtoken");

const secretKey = "hamza21212hamzaabcdefghiklmnop";

function setUser(user) {
  const payload = { user };

  return jwt.sign(payload, secretKey);
}

function getUser(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

module.exports = { setUser, getUser };
