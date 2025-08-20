// services/auth.js
const jwt = require("jsonwebtoken");

const secretKey = "hamza21212hamzaabcdefghiklmnop";

function setUser(user) {
  // make sure to pick only safe fields
  const payload = { user };

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
}

function getUser(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

module.exports = { setUser, getUser };
