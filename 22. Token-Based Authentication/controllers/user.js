const User = require("../models/users");
// const { uid } = require("uid");
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
  // console.log(email, password);
  const user = await User.findOne({
    email,
    password,
  });
  // console.log(user);
  if (!user) {
    // console.log("user is not exxist in db");
    return res.render("login", {
      error: "login and password incorrect",
    });
  }
  // const seesionId = uid();
  // setUser(seesionId, user);
  const token = setUser(user);
  res.cookie("token", token);

  return res.redirect("/");
}
module.exports = { handlUserSignUp, handlUserLogin };
