const User = require("../models/user");

// Handle getting all users
async function handleGetAllUsers(req, res) {
  try {
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Handle getting user by ID
async function handleGetUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Handle creating new user
async function handleCreateNewUser(req, res) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
    });
    res.status(201).json({ id: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Handle updating user by ID
async function handleUpdateUserById(req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Handle deleting user by ID
async function handleDeleteUserById(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateNewUser,
  handleUpdateUserById,
  handleDeleteUserById,
};
