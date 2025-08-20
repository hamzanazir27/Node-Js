# Node.js Authentication Tutorial Notes

## Overview

This tutorial covers implementing **stateful authentication** in Node.js using Express, focusing on session-based authentication with cookies.

---

## 🔐 Authentication Patterns

### Two Main Types:

1. **Stateful Authentication** - Server maintains session data
2. **Stateless Authentication** - No server-side session storage

---

## 📚 Stateful Authentication Concept

### Real-World Analogy: Parking Lot System

```
Person with Car → Parking Attendant → Issues Ticket (ID: 24)
     ↓                    ↓
Attendant records:     Person keeps:
ID 24 = This Car       Parking Ticket #24
     ↓                    ↓
Later: Person returns ticket → Attendant checks diary → Returns correct car

```

**Key Components:**

- **State**: The attendant's diary (server's session storage)
- **Unique ID**: Parking ticket number (session ID)
- **Verification**: Checking the diary to match ID with data

---

## 🏗️ How Stateful Authentication Works

### Flow Diagram:

```
Client → Server: Username + Password
Server → Client: Unique Session ID (stored in cookie)
Client → Server: Session ID with each request
Server: Validates ID → Returns response

```

### Session ID Transfer Methods:

- **Cookies** (for web browsers)
- **Headers** (for REST APIs/mobile apps)
- **Response body** (less common)

---

## 💻 Implementation Steps

### 1. Project Setup

**Required Packages:**

```bash
npm install uuid cookie-parser

```

### 2. User Model (`models/user.js`)

```jsx
const mongoose = require("mongoose");

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
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
```

### 3. Session Service (`service/auth.js`)

```jsx
const sessionIdToUserMap = new Map();

function setUser(id, user) {
  sessionIdToUserMap.set(id, user);
}

function getUser(id) {
  return sessionIdToUserMap.get(id);
}

module.exports = { setUser, getUser };
```

### 4. User Routes (`routes/user.js`)

**Sign Up Route:**

```jsx
const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  await User.create({
    name,
    email,
    password,
  });

  return res.redirect("/");
});
```

**Login Route:**

```jsx
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }

  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie("uid", sessionId);

  return res.redirect("/");
});
```

### 5. Authentication Middleware (`middlewares/auth.js`)

```jsx
const { getUser } = require("../service/auth");

function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;

  if (!userUid) {
    return res.redirect("/login");
  }

  const user = getUser(userUid);

  if (!user) {
    return res.redirect("/login");
  }

  req.user = user;
  next();
}

function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;
  const user = getUser(userUid);

  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};
```

### 6. Main App Configuration (`index.js`)

```jsx
const express = require("express");
const cookieParser = require("cookie-parser");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Protected routes
app.use("/url", restrictToLoggedInUserOnly, urlRouter);

// Public routes
app.use("/user", userRouter);
app.use("/", staticRouter);
```

---

## 🎯 User-Specific URL Management

### Updated URL Model

```jsx
const urlSchema = new mongoose.Schema({
  shortId: { type: String, required: true, unique: true },
  redirectURL: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visitHistory: [{ timestamp: Date }],
});
```

### Show Only User's URLs

```jsx
// In home page route
router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");

  const allUrls = await URL.find({
    createdBy: req.user._id,
  });

  return res.render("home", { urls: allUrls });
});
```

---

## ⚠️ Important Limitations

### Session Storage Issue:

- **Problem**: Session data stored in memory (Map) gets cleared on server restart
- **Impact**: Users need to login again after server restart
- **Solution**: Use persistent storage (Redis, Database) for production

### Cookie Security:

- Use `httpOnly` and `secure` flags in production
- Implement proper cookie expiration
- Consider CSRF protection

---

## 🔄 Authentication Flow Summary

1. **User Registration**: Create user account
2. **User Login**: Validate credentials → Generate session ID → Set cookie
3. **Protected Request**: Check cookie → Validate session → Allow/Deny access
4. **User-Specific Data**: Filter data based on authenticated user

---

## 🛡️ Security Best Practices

- **Never store passwords in plain text** (use bcrypt)
- **Validate all user inputs**
- **Use HTTPS in production**
- **Implement proper session timeout**
- **Add rate limiting for login attempts**
- **Use environment variables for secrets**

---

## 📝 Key Takeaways

- Stateful authentication maintains server-side session data
- Session IDs are unique identifiers linking users to their data
- Middleware functions control access to protected routes
- Cookies are commonly used for web-based session management
- Memory storage is suitable for development but not production

**controllers/url.js**

```cpp
const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {
    id: shortID,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
```

**controllers/user.js**

```cpp
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user)
    return res.render("login", {
      error: "Invalid Username or Password",
    });

  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie("uid", sessionId);
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};
```

**middlewares/auth.js**

```cpp
const { getUser } = require("../service/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;

  if (!userUid) return res.redirect("/login");
  const user = getUser(userUid);

  if (!user) return res.redirect("/login");

  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const userUid = req.cookies?.uid;

  const user = getUser(userUid);

  req.user = user;
  next();
}

module.exports = {
  restrictToLoggedinUserOnly,
  checkAuth,
};
```

**models/url.js**

```cpp
const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;
```

**models/user.js**

```cpp
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
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
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
```

**routes/staticRouter.js**

```cpp
const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const allurls = await URL.find({ createdBy: req.user._id });
  return res.render("home", {
    urls: allurls,
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
```

**routes/url.js**

```cpp
const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
```

**routes/user.js**

```cpp
const express = require("express");
const { handleUserSignup, handleUserLogin } = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);

module.exports = router;
```

**service/auth.js**

```cpp
const sessionIdToUserMap = new Map();

function setUser(id, user) {
  sessionIdToUserMap.set(id, user);
}

function getUser(id) {
  return sessionIdToUserMap.get(id);
}

module.exports = {
  setUser,
  getUser,
};
```

**views/home.ejs**

```cpp
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
    </style>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home Page</title>
  </head>
  <body>
    <h1>URL Shortener</h1>
    <% if (locals.id) { %>
    <p>URL Generated: http://localhost:8001/url/<%= id %></p>
    <% } %>

    <div>
      <form method="POST" action="/url">
        <label>Enter Your Original URL</label>
        <input type="text" name="url" placeholder="https://example.com" />
        <button type="submit">Generate</button>
      </form>
    </div>
    <div style="margin-top: 30px">
      <% if (locals.urls) { %>
      <table>
        <thead>
          <th>S. No</th>
          <th>ShortID</th>
          <th>Redirect</th>
          <th>Clicks</th>
        </thead>
        <tbody>
          <% urls.forEach((url, index) => { %>
          <tr>
            <td><%= index + 1 %></td>
            <td><%= url.shortId %></td>
            <td><%= url.redirectURL %></td>
            <td><%= url.visitHistory.length %></td>
          </tr>
          <% }) %>
        </tbody>
      </table>
      <% } %>
    </div>
  </body>
</html>
```

**views/login.ejs**

```cpp
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
    </style>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login</title>
  </head>
  <body>
    <h1>Login</h1>
    <form action="/user/login" method="post">
      <label>Email</label>
      <input type="text" required name="email" />
      <label>Password</label>
      <input type="text" required name="password" />

      <button type="submit">Login</button>
    </form>
  </body>
</html>
```

**views/signup.ejs**

```cpp
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      }
    </style>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup</title>
  </head>
  <body>
    <h1>Signup</h1>
    <form action="/user" method="post">
      <label>Full Name</label>
      <input type="text" required name="name" />
      <label>Email</label>
      <input type="text" required name="email" />
      <label>Password</label>
      <input type="text" required name="password" />

      <button type="submit">Signup</button>
    </form>
  </body>
</html>
```

**connect.js**

```cpp
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};
```

**index.js**

```cpp
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGODB ?? "mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", checkAuth, staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
```

# URL Shortener Application - Complete Code Analysis

## 📋 **Overview**

This is a **URL shortener web application** built with Node.js, Express.js, MongoDB, and EJS templating. Users can create accounts, log in, and generate shortened URLs that redirect to original links.

---

## 🏗️ **Application Architecture**

```
URL Shortener App Structure
├── index.js (main server file)
├── connect.js (database connection)
├── controllers/
│   ├── url.js (URL operations)
│   └── user.js (user authentication)
├── middlewares/
│   └── auth.js (authentication middleware)
├── models/
│   ├── url.js (URL database schema)
│   └── user.js (User database schema)
├── routes/
│   ├── url.js (URL endpoints)
│   ├── user.js (user endpoints)
│   └── staticRouter.js (page routes)
├── service/
│   └── auth.js (session management)
└── views/
    ├── home.ejs (main page)
    ├── login.ejs (login form)
    └── signup.ejs (registration form)

```

---

## 🔧 **Core Components**

### **1. Main Server (index.js)**

- **Port**: 8001
- **Database**: MongoDB connection (local or environment variable)
- **View Engine**: EJS for server-side rendering
- **Middleware Used**:
  - `express.json()` - parses JSON requests
  - `express.urlencoded()` - parses form data
  - `cookie-parser` - handles cookies for sessions

**Key Route Structure**:

```
/url/* → URL operations (login required)
/user/* → User authentication
/ → Static pages (optional login)
/url/:shortId → Redirect to original URL

```

### **2. Database Models**

### **URL Model (models/url.js)**

```jsx
{
  shortId: String (unique identifier)
  redirectURL: String (original URL)
  visitHistory: Array of timestamps
  createdBy: ObjectId (references user)
  timestamps: true (auto-created/updated dates)
}

```

### **User Model (models/user.js)**

```jsx
{
  name: String (full name)
  email: String (unique identifier)
  password: String (plain text - SECURITY ISSUE)
  timestamps: true (auto-created/updated dates)
}

```

---

## 🔐 **Authentication System**

### **Session Management (service/auth.js)**

- Uses **in-memory Map** to store user sessions
- **Not persistent** - sessions lost on server restart

```
Session Flow:
Login → Generate UUID → Store in Map → Set Cookie → Access Protected Routes

```

### **Authentication Middleware (middlewares/auth.js)**

### **restrictToLoggedinUserOnly**

- **Purpose**: Blocks access to protected routes
- **Process**: Check cookie → Validate session → Allow/Redirect

### **checkAuth**

- **Purpose**: Optional authentication for pages
- **Process**: Check session but don't block access

---

## 🌐 **Route Handlers**

### **URL Operations (controllers/url.js)**

### **handleGenerateNewShortURL**

```
Input: { url: "https://example.com" }
Process:
1. Validate URL exists
2. Generate short ID using shortid library
3. Save to database with user reference
4. Render home page with generated ID
Output: Rendered page showing new short URL

```

### **handleGetAnalytics**

```
Input: Short ID from URL parameter
Process: Find URL document in database
Output: JSON with total clicks and visit history

```

### **User Operations (controllers/user.js)**

### **handleUserSignup**

```
Input: { name, email, password }
Process: Create new user in database
Output: Redirect to home page

```

### **handleUserLogin**

```
Input: { email, password }
Process:
1. Find user with matching credentials
2. Generate session ID
3. Store session and set cookie
Output: Redirect to home page or show error

```

---

## 📄 **Frontend Views (EJS Templates)**

### **Home Page (views/home.ejs)**

- **URL Generation Form**: Input field for original URL
- **Success Message**: Shows generated short URL
- **URL Table**: Displays user's created URLs with click counts

### **Login Page (views/login.ejs)**

- **Simple form**: Email and password fields
- **Error handling**: Shows login error messages

### **Signup Page (views/signup.ejs)**

- **Registration form**: Name, email, password fields
- **Action**: Posts to `/user` endpoint

---

## 🔄 **Application Flow**

```
User Journey:
1. Visit website → Redirected to login
2. Register/Login → Create session → Access home page
3. Enter URL → Generate short link → View in table
4. Share short link → Others click → Redirect + analytics

URL Redirection Process:
GET /url/:shortId → Find in database → Update visit history → Redirect to original URL

```

---

## ⚠️ **Security Issues & Improvements Needed**

### **Critical Security Problems**

- **Plain text passwords** - Should use bcrypt hashing
- **No password validation** - No strength requirements
- **In-memory sessions** - Lost on server restart
- **No CSRF protection** - Vulnerable to cross-site attacks
- **No input validation** - URLs not validated for format
- **No rate limiting** - Vulnerable to abuse

### **Recommended Fixes**

- Hash passwords with bcrypt
- Use Redis or database for session storage
- Add input validation and sanitization
- Implement rate limiting
- Add CSRF tokens
- Use HTTPS in production

---

## 📊 **Database Schema Visualization**

```
Users Collection:
┌─────────────────────────────────────┐
│ _id: ObjectId                       │
│ name: "John Doe"                    │
│ email: "john@example.com"           │
│ password: "plaintext123"            │
│ createdAt: Date                     │
│ updatedAt: Date                     │
└─────────────────────────────────────┘
                    │
                    │ (one-to-many)
                    ▼
URLs Collection:
┌─────────────────────────────────────┐
│ _id: ObjectId                       │
│ shortId: "abc123"                   │
│ redirectURL: "https://google.com"   │
│ visitHistory: [                     │
│   { timestamp: 1629123456789 },     │
│   { timestamp: 1629123556789 }      │
│ ]                                   │
│ createdBy: ObjectId (ref to user)   │
│ createdAt: Date                     │
│ updatedAt: Date                     │
└─────────────────────────────────────┘

```

---

## 🚀 **Setup & Running**

### **Prerequisites**

- Node.js installed
- MongoDB running (local or remote)

### **Required Dependencies**

```
express - web framework
mongoose - MongoDB ODM
ejs - templating engine
cookie-parser - cookie handling
shortid - generates short IDs
uuid - generates session IDs

```

### **Environment Variables**

- `MONGODB` - MongoDB connection string (optional, defaults to local)

### **Starting the Application**

1. Install dependencies: `npm install`
2. Start MongoDB service
3. Run: `node index.js`
4. Access: `http://localhost:8001`

---

## 🎯 **Key Features**

### **For Users**

- Account registration and login
- Create shortened URLs
- View all created URLs with click statistics
- Automatic redirection when short URLs are accessed

### **For Analytics**

- Track click counts for each URL
- Store timestamp data for each visit
- API endpoint for detailed analytics

---

## 🔍 **Technical Notes**

### **Important Libraries Used**

- **shortid**: Generates URL-safe short identifiers
- **uuid**: Creates unique session identifiers
- **mongoose**: MongoDB object modeling

### **Session Management**

- Sessions stored in server memory (Map object)
- Session ID stored in browser cookie named "uid"
- Sessions don't persist across server restarts

### **URL Generation Process**

1. User submits original URL
2. Generate unique short ID
3. Store mapping in database with user reference
4. Display short URL to user
5. Track visits when short URL is accessed

This application provides a basic but functional URL shortening service with user authentication and basic analytics tracking.
