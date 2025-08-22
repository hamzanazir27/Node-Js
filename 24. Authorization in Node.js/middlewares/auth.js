const { getUser } = require("../services/auth");

// Extract token from cookies instead of headers
async function checkForAuthentication(req, res, next) {
  try {
    const tokenCookie = req.cookies?.token;

    if (!tokenCookie) {
      req.user = null;
      return next();
    }

    const user = getUser(tokenCookie);

    if (!user || !user.user) {
      req.user = null;
      // Clear invalid token
      res.clearCookie("token");
      return next();
    }

    req.user = user.user;
    return next();
  } catch (error) {
    console.error("Authentication error:", error);
    req.user = null;
    res.clearCookie("token");
    return next();
  }
}

function restrictTo(roles) {
  return function (req, res, next) {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.redirect("/login");
      }

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        return res.status(403).send("Access denied. Insufficient permissions.");
      }

      return next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).send("Internal server error");
    }
  };
}

module.exports = { checkForAuthentication, restrictTo };

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

This fix ensures your middleware won't crash when tokens are missing or invalid, and each function behaves according to its intended purpose
 */
