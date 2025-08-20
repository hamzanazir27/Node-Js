const { getUser } = require("../services/auth");

async function restrictTOUserLoginOnly(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const { user } = getUser(token);
  if (!user) return res.redirect("/login");
  req.user = user;
  next();
}
async function checkAuth(req, res, next) {
  const token = req.cookies.token;
  const { user } = getUser(token);
  req.user = user;
  next();
}

module.exports = { restrictTOUserLoginOnly, checkAuth };
