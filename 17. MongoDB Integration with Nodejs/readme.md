# MongoDB Integration with Node.js using Mongoose

## Overview

This tutorial covers connecting a Notes application to MongoDB database using Mongoose, replacing file-based data storage with database operations.

## Prerequisites

- MongoDB service must be running on `localhost:27017`
- Check MongoDB status: `mongo`

## Installation and Setup

### 1. Install Mongoose Package

```bash
npm install mongoose

```

- Mongoose is a package that helps connect Node.js applications to MongoDB

### 2. Basic Mongoose Concepts

```
┌─────────────────────────────────────────┐    |
│            MONGOOSE WORKFLOW            │    |
├─────────────────────────────────────────┤    |
│  1. SCHEMA → Define data structure      │    |
│  2. MODEL → Create from schema          │    |
│  3. OPERATIONS → CRUD using model       │
└─────────────────────────────────────────┘

```

## Code Implementation

### 3. Import and Connect to MongoDB

```jsx
// Import mongoose
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/youtube-app")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
```

### 4. Create User Schema

```jsx
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
```

### 5. Create Model from Schema

```jsx
// Create User model
const User = mongoose.model("User", userSchema);
```

**Note:** MongoDB automatically converts 'User' to 'users' (plural) for the collection name.

## CRUD Operations

### 6. CREATE - Adding New Users

```jsx
// POST route - Create new user
app.post("/api/users", async (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    gender: req.body.gender,
    jobTitle: req.body.jobTitle,
  });

  await user.save();
  return res.json({ message: "success" });
});
```

### 7. READ - Getting All Users

```jsx
// GET route - Fetch all users
app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({}); // Empty {} means get all users
  return res.json(allDbUsers);
});
```

### 8. READ - Getting Single User

```jsx
// GET route - Fetch user by ID
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json(user);
});
```

### 9. UPDATE - Modifying User Data

```jsx
// PATCH route - Update user
app.patch("/api/users/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    lastName: "Changed", // Example: changing last name
  });
  return res.json({ message: "success" });
});
```

### 10. DELETE - Removing Users

```jsx
// DELETE route - Remove user
app.delete("/api/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.json({ message: "success" });
});
```

## Key Features Explained

### Unique Email Constraint

- `unique: true` prevents duplicate email addresses
- MongoDB will return an error if you try to insert a duplicate email

### Automatic Timestamps

- `timestamps: true` adds `createdAt` and `updatedAt` fields automatically
- These fields track when records are created and modified

### Automatic ID Generation

- MongoDB automatically generates `_id` field for each document
- This serves as the primary key

## Data Flow Diagram

```
┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend   │───▶│   Express   │───▶│   MongoDB   │
│  (POST/GET)  │    │   Routes    │    │  Database   │
└──────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Mongoose  │
                    │    Model    │
                    └─────────────┘

```

## Testing the API

Use tools like Postman to test:

- **POST** `localhost:8000/api/users` - Create user
- **GET** `localhost:8000/api/users` - Get all users
- **GET** `localhost:8000/api/users/:id` - Get specific user
- **PATCH** `localhost:8000/api/users/:id` - Update user
- **DELETE** `localhost:8000/api/users/:id` - Delete user

## Important Notes

- Replace file operations (`fs.writeFile`, `fs.readFile`) with database operations
- All database operations should be `async/await`
- Always handle errors appropriately
- The code needs refactoring using MVC pattern for production use

## Next Steps

- Learn MVC (Model-View-Controller) pattern
- Refactor code for better organization
- Build complete projects using this foundation

---

---
