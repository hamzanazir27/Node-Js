const express = require("express");
const {
  handleGetAllUsers,
  handleGetUserById,
  handleCreateNewUser,
  handleUpdateUserById,
  handleDeleteUserById,
} = require("../controllers/user");

const router = express.Router();

// User routes
router.get("/", handleGetAllUsers); // GET /users
router.post("/", handleCreateNewUser); // POST /users
router.get("/:id", handleGetUserById); // GET /users/:id
router.patch("/:id", handleUpdateUserById); // PATCH /users/:id
router.delete("/:id", handleDeleteUserById); // DELETE /users/:id

module.exports = router;
