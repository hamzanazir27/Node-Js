console.log(
  "=".repeat(40),
  "Node Code By Hamza (MongoDb connect Node )",
  "=".repeat(40)
);
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/hamza-db")
  .then(() => console.log("hamza-db connected"))
  .catch((err) => console.log(err));

// Define user schema structure
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // This field is mandatory
    },
    lastName: {
      type: String,
      required: false, // This field is optional
    },
    email: {
      type: String,
      required: true,
      unique: true, // No duplicate emails allowed
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

// Create User model
const User = mongoose.model("User", userSchema);

app.listen(8000);

// POST route - Create new user
app.post("/user", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    jobTitle: req.body.jobTitle,
  });

  await user.save();
  return res.json({ message: "sussfully created" });
});

//get users all

app.get("/users", async (req, res) => {
  const users = await User.find();
  return res.json(users);
});

//get specific user

app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json(user);
});

//Update
app.patch("/user/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    lastName: `updated `,
  });
  return res.status(200).json({ message: "suceesfully updated" });
});

//delete
app.delete("/user/:id", async (req, res) => {
  const users = await User.findByIdAndDelete(req.params.id);
  return res.status(200).json({ message: "suceesfully deleted" });
});
