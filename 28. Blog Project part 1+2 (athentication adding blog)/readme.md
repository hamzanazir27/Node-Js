# Complete Blog Application Development Notes

## New Learning

### Password Hashing

- **What it is:** Instead of storing raw password in the database, we store a **hashed version** of it.
- **Why:** If database leaks, attacker cannot see plain text passwords.
- **How:**
  1. Generate a **salt** → random string added to the password.
  2. Use `crypto.createHmac(algorithm, salt)` to create a hash function.
  3. Update the hash with the password → `.update(password)`
  4. Convert to hex string → `.digest("hex")`
  5. Store `hashedPassword` and `salt` in database.
- **Example in code:**
  ```jsx
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  user.password = hashedPassword;
  user.salt = salt;
  ```

### Signin With Hashed Password

- **Problem:** During signin, we don’t know the raw password stored in DB (only hash is saved).
- **Solution:**
  1. Take email and password from user.
  2. Find user in DB by email.
  3. Take the stored `salt` from DB.
  4. Hash the given password again with the **same salt**.
  5. Compare the new hash with stored hash.
  6. If same → login success. Else → incorrect password.
- **Example in code:**
  ```jsx
  const userProvidedHash = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (user.password === userProvidedHash) {
    // success → user authenticated
  } else {
    // failure → incorrect password
  }
  ```
- **Key Point:** Hashing is one-way → original password cannot be retrieved, only verified by comparing hashes.

---

Lets Start the project

## Project Overview

This tutorial covers building a complete blog application with authentication, CRUD operations, and deployment using Node.js, Express, MongoDB, and EJS templating.

## Table of Contents

1. Project Setup
2. Folder Structure
3. User Model & Password Hashing
4. Views & UI Setup
5. Complete Code Files

---

## Project Setup

### Initial Setup

- Create empty project folder
- Initialize npm: `npm init`
- Set project name as "youtube-blog"

### Dependencies Installation

```bash
# Main dependencies
npm install express mongoose

# Development dependencies
npm install -D nodemon

```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

**Note**: `-D` flag installs as devDependencies (only needed during development, reduces production bundle size)

---

## Folder Structure

```
project/
├── index.js
├── package.json
├── models/
│   └── user.js
├── routes/
│   └── user.js
├── views/
│   ├── home.ejs
│   ├── signup.ejs
│   ├── signin.ejs
│   └── partials/
│       ├── head.ejs
│       ├── nav.ejs
│       └── scripts.ejs
├── controllers/
└── public/
    └── images/
        └── default.png

```

**Visual Representation:**

```
📁 Project Root
├── 📄 index.js (Main server file)
├── 📁 models (Database schemas)
├── 📁 routes (API endpoints)
├── 📁 views (Frontend templates)
├── 📁 controllers (Business logic)
└── 📁 public (Static files)

```

---

## User Model & Password Hashing

### Why Hash Passwords?

- **Security**: If database is hacked, original passwords remain hidden
- **Salt**: Random string added to password before hashing
- **One-way process**: Cannot convert hash back to original password

### Hashing Process Flow:

```
User Password → Salt Generation → Hash Creation → Store in DB
     ↓              ↓               ↓              ↓
   "123456"    "randomsalt16"   "hashedstring"   Database

```

### User Schema Structure

```jsx
// models/user.js
const mongoose = require("mongoose");
const crypto = require("crypto");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);
```

### Password Hashing Implementation

### Pre-save Middleware (Automatic Hashing)

```jsx
// Hash password before saving to database
userSchema.pre("save", function (next) {
  const user = this;

  // Only hash if password is modified
  if (!user.isModified("password")) return next();

  // Generate random salt (16 characters)
  const salt = crypto.randomBytes(16).toString("hex");

  // Create hash using salt and password
  const hashedPassword = crypto
    .createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  // Update user object
  user.salt = salt;
  user.password = hashedPassword;

  next();
});
```

### Password Matching (For Login)

```jsx
// Static method to verify password
userSchema.static("matchPassword", function (email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      // Find user by email
      const user = await this.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }

      // Hash provided password with user's salt
      const userProvidedHash = crypto
        .createHmac("sha256", user.salt)
        .update(password)
        .digest("hex");

      // Compare hashes
      if (user.password === userProvidedHash) {
        // Remove sensitive data before returning
        user.password = undefined;
        user.salt = undefined;
        resolve(user);
      } else {
        throw new Error("Incorrect password");
      }
    } catch (error) {
      reject(error);
    }
  });
});

module.exports = model("User", userSchema);
```

---

## Authentication System

### Sign Up Route

```jsx
// routes/user.js
const express = require("express");
const User = require("../models/user");
const router = express.Router();

// GET signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// POST signup (create user)
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Create new user (password will be hashed automatically)
    await User.create({
      fullName,
      email,
      password,
    });

    // Redirect to home page after successful signup
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating user");
  }
});
```

### Sign In Route

```jsx
// GET signin page
router.get("/signin", (req, res) => {
  res.render("signin");
});

// POST signin (authenticate user)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use static method to verify credentials
    const user = await User.matchPassword(email, password);

    // If successful, redirect to home
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid credentials");
  }
});

module.exports = router;
```

---

## Views & UI Setup

### Partials System (Reusable Components)

Instead of repeating HTML code, we use partials for common elements:

### Head Partial (Bootstrap & CSS)

```html
<!-- views/partials/head.ejs -->
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Bloggify</title>
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
```

### Navigation Partial

```html
<!-- views/partials/nav.ejs -->
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">Bloggify</a>

    <div class="navbar-nav">
      <a class="nav-link" href="/">Home</a>
      <a class="btn btn-primary" href="/user/signup">Add Blog</a>
    </div>

    <!-- User dropdown (if logged in) -->
    <div class="dropdown">
      <a
        class="btn btn-secondary dropdown-toggle"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
      >
        User Name
      </a>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Logout</a></li>
      </ul>
    </div>
  </div>
</nav>
```

### Scripts Partial

```html
<!-- views/partials/scripts.ejs -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

### Using Partials in Pages

```html
<!-- views/home.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <%- include('./partials/head') %>
  </head>
  <body>
    <%- include('./partials/nav') %>

    <div class="container mt-4">
      <h1>Welcome to Bloggify</h1>
      <!-- Blog content will go here -->
    </div>

    <%- include('./partials/scripts') %>
  </body>
</html>
```

---

## Complete Code Files

### 1. Main Server File (index.js)

```jsx
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
mongoose
  .connect("mongodb://localhost:27017/bloggify")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.urlencoded({ extended: false })); // For form data
app.use(express.static(path.resolve("./public"))); // Static files

// Routes
app.use("/user", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`Server started at PORT:${PORT}`);
});
```

### 2. User Model (models/user.js)

```jsx
const mongoose = require("mongoose");
const crypto = require("crypto");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Pre-save middleware for password hashing
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// Static method for password verification
userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const userProvidedHash = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");

  if (user.password === userProvidedHash) {
    user.password = undefined;
    user.salt = undefined;
    return user;
  } else {
    throw new Error("Incorrect password");
  }
});

module.exports = model("User", userSchema);
```

### 3. User Routes (routes/user.js)

```jsx
const express = require("express");
const User = require("../models/user");
const router = express.Router();

// GET signup page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// POST signup
router.post("/signup", async (req, res) => {
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
    res.status(500).send("Error creating user");
  }
});

// GET signin page
router.get("/signin", (req, res) => {
  res.render("signin");
});

// POST signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.matchPassword(email, password);

    return res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).send("Invalid credentials");
  }
});

module.exports = router;
```

### 4. Signup Form (views/signup.ejs)

```html
<!DOCTYPE html>
<html>
  <head>
    <%- include('./partials/head') %>
  </head>
  <body>
    <%- include('./partials/nav') %>

    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2>Sign Up</h2>
          <form action="/user/signup" method="POST">
            <div class="mb-3">
              <label for="fullName" class="form-label">Full Name</label>
              <input
                type="text"
                class="form-control"
                id="fullName"
                name="fullName"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary">Sign Up</button>
          </form>
        </div>
      </div>
    </div>

    <%- include('./partials/scripts') %>
  </body>
</html>
```

### 5. Signin Form (views/signin.ejs)

```html
<!DOCTYPE html>
<html>
  <head>
    <%- include('./partials/head') %>
  </head>
  <body>
    <%- include('./partials/nav') %>

    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2>Sign In</h2>
          <form action="/user/signin" method="POST">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary">Sign In</button>
          </form>
        </div>
      </div>
    </div>

    <%- include('./partials/scripts') %>
  </body>
</html>
```

---

## Key Learning Points

### Security Best Practices

- ✅ **Always hash passwords** before storing in database
- ✅ **Use salt** for each password to prevent rainbow table attacks
- ✅ **Never store plain text passwords**
- ✅ **Remove sensitive data** from API responses

### Development Workflow

- ✅ **Use nodemon** for development (auto-restart server)
- ✅ **Separate dev and production dependencies**
- ✅ **Use partials** to avoid code repetition
- ✅ **Proper error handling** with try-catch blocks

### Next Steps (Mentioned for Future Videos)

- Implement JWT token-based authentication
- Add session management
- Create blog CRUD operations
- File upload functionality
- Deployment to cloud platforms

---

## Running the Application

1. **Start MongoDB** (ensure MongoDB is installed and running)
2. **Install dependencies**: `npm install`
3. **Run in development**: `npm run dev`
4. **Access the application**: `http://localhost:8000`

**Test the authentication:**

- Go to `/user/signup` to create a new account
- Go to `/user/signin` to log in
- Check MongoDB database to see hashed passwords

This completes the foundation of a secure blog application with user authentication!
