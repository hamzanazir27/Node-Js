const { use } = require("../routes/url");
const { getUser } = require("../services/auth");

async function restrictTOUserLoginOnly(req, res, next) {
  // const token = req.cookies.token;
  const userid = req.headers["Authorization"];
  if (!userid) return res.redirect("/login");
  const token = userid.split("Bearer ")[1];
  const result = getUser(token);
  if (!result || !result.user) return res.redirect("/login");

  req.user = result.user;
  next();
}

async function checkAuth(req, res, next) {
  const userid = req.headers["authorization"];
  const token = userid.split("Bearer ")[1];

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
