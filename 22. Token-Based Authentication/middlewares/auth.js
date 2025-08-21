const { getUser } = require("../services/auth");

async function restrictTOUserLoginOnly(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const result = getUser(token);
  if (!result || !result.user) return res.redirect("/login");

  req.user = result.user;
  next();
}

async function checkAuth(req, res, next) {
  const token = req.cookies.token;

  // Handle case where token doesn't exist
  if (!token) {
    req.user = null;
    return next();
  }

  // Handle case where getUser returns null
  const result = getUser(token);
  if (!result) {
    req.user = null;
    return next();
  }

  req.user = result.user;
  next();
}

module.exports = { restrictTOUserLoginOnly, checkAuth };

/**
 * Allways remember
 * 
 * 
 * Check for token existence first - Before calling getUser(), check if the token exists
Store the result of getUser() - Instead of destructuring immediately, store the result and check if it's null
Safe destructuring - Only destructure the user property after confirming the result isn't null

The main difference between restrictTOUserLoginOnly and checkAuth is that:

restrictTOUserLoginOnly redirects to login if no valid user is found (strict authentication)
checkAuth allows the request to continue even without authentication, just setting req.user to null (optional authentication)

This fix ensures your middleware won't crash when tokens are missing or invalid, and each function behaves according to its intended purpo
 */
