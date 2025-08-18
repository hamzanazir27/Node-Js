# Model-View-Controller (MVC) Pattern - Refactoring Tutorial Notes

## What is MVC Architecture?

**Model-View-Controller (MVC)** is a design pattern that separates an application into three main components:

- **Model**: Handles data and database operations
- **View**: Handles the user interface and presentation
- **Controller**: Handles user input and coordinates between Model and View

### MVC Flow:

```
Controller → manipulates → Model → updates → View

```

## Problem with Current Code Structure

The current `index.js` file has become **polluted** with too much code:

- All routes, database connections, and business logic in one file
- **Maintainability issues** - difficult to manage as project grows
- Hard to work in teams
- Difficult to make changes

## Solution: Refactoring into MVC Structure

### Step 1: Create Folder Structure

Create the following folders:

```
project/
├── models/
├── controllers/
├── routes/
├── views/
├── middlewares/
└── config/

```

### Step 2: Separate Database Models

**Create `models/user.js`:**

```jsx
const mongoose = require("mongoose");

// User Schema Definition
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

// Create and export User model
module.exports = mongoose.model("User", userSchema);
```

### Step 3: Create Database Connection File

**Create `config/connection.js`:**

```jsx
const mongoose = require("mongoose");

// Function to connect to MongoDB
function connectMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = { connectMongoDB };
```

### Step 4: Create Middleware

**Create `middlewares/index.js`:**

```jsx
const fs = require("fs");

// Logging middleware function
function logReqRes(filename) {
  return function (req, res, next) {
    fs.appendFile(
      filename,
      `${Date.now()}: ${req.method} ${req.path}\n`,
      (err) => {
        if (err) console.log(err);
        next();
      }
    );
  };
}

module.exports = { logReqRes };
```

### Step 5: Create Controllers

**Create `controllers/user.js`:**

```jsx
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
```

### Step 6: Create Routes

**Create `routes/user.js`:**

```jsx
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
```

### Step 7: Update Main Index File

**Update `index.js`:**

```jsx
const express = require("express");
const { connectMongoDB } = require("./config/connection");
const { logReqRes } = require("./middlewares");
const userRouter = require("./routes/user");

const app = express();
const PORT = 8000;

// Database connection
connectMongoDB("mongodb://localhost:27017/youtube")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logReqRes("log.txt"));

// Routes
app.use("/api/users", userRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
```

## Final Project Structure

```
project/
├── index.js                 (Main server file - clean and organized)
├── config/
│   └── connection.js         (Database connection)
├── middlewares/
│   └── index.js             (Logging middleware)
├── models/
│   └── user.js              (User data model)
├── controllers/
│   └── user.js              (Business logic)
└── routes/
    └── user.js              (Route definitions)

```

## Visual Flow Representation

```
HTTP Request
     ↓
┌─────────────┐
│   index.js  │ ← Main entry point
└─────────────┘
     ↓
┌─────────────┐
│ Middleware  │ ← Request logging
└─────────────┘
     ↓
┌─────────────┐
│   Routes    │ ← /api/users/*
└─────────────┘
     ↓
┌─────────────┐
│ Controller  │ ← Business logic
└─────────────┘
     ↓
┌─────────────┐
│   Model     │ ← Database operations
└─────────────┘
     ↓
   Database

```

## Benefits of MVC Refactoring

### 1. **Better Organization**

- Each component has a specific responsibility
- Easy to locate and modify specific functionality

### 2. **Team Collaboration**

- Multiple developers can work on different parts
- Clear separation of concerns

### 3. **Maintainability**

- Easy to add new features
- Simple to debug issues
- Modular structure

### 4. **Scalability**

- Easy to add new models, controllers, and routes
- Can easily change route structures
- Better code reusability

### 5. **Flexibility**

- Can easily change API endpoints (e.g., from `/api/users` to `/users`)
- Easy to switch database models
- Simple to modify business logic

## Testing the Refactored Code

### API Endpoints:

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Example Usage with Postman:

1. **GET** `localhost:8000/api/users` - Returns all users
2. **POST** `localhost:8000/api/users` with JSON body to create user
3. **GET** `localhost:8000/api/users/[user_id]` - Get specific user
4. **DELETE** `localhost:8000/api/users/[user_id]` - Delete user

## Key Takeaways

- **Separation of Concerns**: Each file has one specific purpose
- **Express Router**: Use `express.Router()` for modular routes
- **Controller Functions**: Handle business logic separately from routes
- **Model Exports**: Use `module.exports` to share code between files
- **Clean Main File**: Keep `index.js` minimal and focused on setup

This MVC pattern makes your Node.js application more professional, maintainable, and scalable for production environments.
