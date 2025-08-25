const express = require("express");
const User = require("../models/user");
async function userSignin(req, res) {
  try {
    const { email, password } = req.body;

    const tokenGen = await User.matchPasswordAndGenrateToken(email, password);
    return res.cookie("token", tokenGen).redirect("/");
  } catch (error) {
    // res.render();
    // console.error("Login error:", error);

    return res.render("signin", {
      error: "Invalid credentials",
    });
  }
}

async function userSignup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    await User.create({
      fullName,
      email,
      password,
    });

    return res.redirect("/");
  } catch (error) {
    console.error(error);

    //  Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).send("Email already exists");
    }

    res.status(500).send("Error creating user");
  }
}

module.exports = { userSignin, userSignup };
