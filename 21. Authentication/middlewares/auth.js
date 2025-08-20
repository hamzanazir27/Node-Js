const { getUser } = require("../services/auth");

async function restrictTOUserLoginOnly(req, res, next) {
  const uid = req.cookies.uid;
  if (!uid) return res.redirect("/login");

  const User = getUser(uid);
  if (!User) return res.redirect("/login");
  req.user = User;
  next();
}
async function checkAuth(req, res, next) {
  const uid = req.cookies.uid;
  const User = getUser(uid);
  req.user = User;
  next();
}

module.exports = { restrictTOUserLoginOnly, checkAuth };
