const JWT = require("jsonwebtoken");
require("dotenv").config(); // important

// Create a .env file in the project root and add JWT_SECRET=your_secret_key.
// Add .env to .gitignore so it won’t be pushed to Git.
// Load environment variables with require("dotenv").config().
// Use process.env.JWT_SECRET when generating or verifying tokens
const secret = process.env.JWT_SECRET;
function createTokenForUser(user) {
  const payload = {
    _id: user.id,
    fullName: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
