const User = require("../models/users");
const { uid } = require("uid");
const { setUser } = require("../services/auth");
async function handlUserSignUp(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}
async function handlUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
    password,
  });
  if (!user) {
    return res.render("login", {
      error: "login and password incorrect",
    });
  }
  const seesionId = uid();
  setUser(seesionId, user);
  res.cookie("uid", seesionId);

  return res.redirect("/");
}
module.exports = { handlUserSignUp, handlUserLogin };
