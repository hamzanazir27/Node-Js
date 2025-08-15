# Express.js – Full Detailed Notes

---

## **1. Background – Life Without Express**

Before Express, we used **Node.js `http` module** to create web servers.

### **Typical Flow**

```jsx
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === "/" && req.method === "GET") {
    res.end("Hello from Home Page");
  } else if (parsedUrl.pathname === "/about" && req.method === "GET") {
    res.end("Hello from About Page");
  } else {
    res.statusCode = 404;
    res.end("Page Not Found");
  }
});

server.listen(8000, () => {
  console.log("Server running on port 8000");
});
```

### **Problems**

1. **Single Handler Function**:
   - One large function must handle **all routes and methods**.
   - Becomes messy and unreadable quickly.
2. **Manual Method & Path Checks**:
   - Must check `req.url` and `req.method` manually.
   - Uses `if`/`else` or `switch` statements for every route.
3. **Manual Parameter Parsing**:
   - Query params → Need `url` module.
   - Body data → Need `body-parser` or `querystring` module.
   - Headers → Extract manually from `req.headers`.
4. **No Built-in Organization**:
   - Developer writes **everything from scratch**.
   - No separation of concerns.
   - No built-in routing structure.

---

### **ASCII Representation – Before Express**

```
CLIENT REQUEST
   |
   v
[http.createServer(handler)]
   |
   v
[Handler function]
   |
   +--> Check req.method manually
   +--> Check req.url manually
   +--> Parse query params (url module)
   +--> Parse body data (extra packages)
   |
   v
[Send Response]

```

---

## **2. Why Express Was Created**

Express.js is a **fast, minimalist, unopinionated web framework** for Node.js.

### **Main Goals**

- **Simplify server creation** (no manual `http.createServer` code).
- **Provide built-in routing** (handle GET, POST, etc., cleanly).
- **Automatic request parsing** (query, params, body).
- **Cleaner, modular code** for scalability.
- **Middleware support** for extra features.

---

## **3. How Express Solves the Problem**

- Express **internally** uses Node’s `http` module.
- It automatically:
  - Creates the server.
  - Registers routes for specific HTTP methods and paths.
  - Parses incoming request data.
- Developer only writes:
  ```jsx
  app.get("/path", (req, res) => {...});

  ```

---

### **ASCII Representation – After Express**

```
CLIENT REQUEST
   |
   v
[Express Internal Handler]
   |
   +--> Match route path automatically
   +--> Match HTTP method automatically
   +--> Parse query params → req.query
   +--> Parse URL params → req.params
   +--> Parse body data (if middleware added)
   |
   v
[Route Handler Function Runs]
   |
   v
[res.send()/res.json()/res.status()]

```

---

## **4. Installing Express**

```bash
npm install express

```

This adds to **package.json**:

```json
"dependencies": {
  "express": "^4.18.2"
}

```

- **Version format** (Semantic Versioning):
  - **4** → Major version (breaking changes)
  - **18** → Minor version (new features, backward compatible)
  - **2** → Patch version (bug fixes)

---

## **5. Basic Express Server Example**

```jsx
const express = require("express");
const app = express(); // Create Express application

// Route for Home Page
app.get("/", (req, res) => {
  res.send("Hello from Home Page");
});

// Route for About Page
app.get("/about", (req, res) => {
  res.send("Hello from About Page");
});

// Start the server
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
```

---

## **6. Express Route Syntax**

```jsx
app.METHOD(PATH, HANDLER);
```

- **METHOD**: HTTP method in lowercase (`get`, `post`, `put`, `patch`, `delete`)
- **PATH**: URL path (string or pattern)
- **HANDLER**: Function `(req, res) => {}` that handles the request.

Example:

```jsx
app.post("/submit", (req, res) => {
  res.send("Data submitted!");
});
```

---

## **7. Handling Query Parameters**

```jsx
app.get("/greet", (req, res) => {
  const name = req.query.name; // e.g. ?name=Hamza
  res.send(`Hello ${name}`);
});
```

**Request**: `http://localhost:8000/greet?name=Hamza`

**Response**: `Hello Hamza`

---

## **8. Handling URL Parameters**

```jsx
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
});
```

**Request**: `http://localhost:8000/user/42`

**Response**: `User ID is 42`

---

## **9. Mixing Parameters and Query**

```jsx
app.get("/user/:id/details", (req, res) => {
  res.send(`User ${req.params.id}, Age ${req.query.age}`);
});
```

**Request**:

`http://localhost:8000/user/42/details?age=25`

**Response**: `User 42, Age 25`

---

## **10. How Express Cleans the Code**

### Before:

```jsx
if (req.url === "/" && req.method === "GET") {...}
else if (req.url === "/about" && req.method === "GET") {...}

```

### After:

```jsx
app.get("/", handler1);
app.get("/about", handler2);
```

✅ **No `if`/`else` or `switch` needed**

✅ **Built-in request parsing**

✅ **Readable route definitions**

---

## **11. Express Internals (Behind the Scenes)**

- When you call:
  ```jsx
  app.get("/", handler);
  ```
  Express:
  1. Stores the route definition in an internal list.
  2. When a request arrives, it:
     - Matches the request path to a stored route.
     - Matches the HTTP method.
     - Passes the request to the route’s handler.
  3. Provides ready-made objects:
     - `req` → contains request data (params, query, body, headers).
     - `res` → contains response methods (`send`, `json`, `status`).

---

## **12. Example – Query + Dynamic Routing**

```jsx
app.get("/about", (req, res) => {
  const name = req.query.name || "Guest";
  res.send(`Hello ${name} from About Page`);
});
```

**Request**:

`http://localhost:8000/about?name=Piyush`

**Response**:

`Hello Piyush from About Page`

---

## **13. Removing URL Module**

- In `http` module, we required:
  ```jsx
  const url = require("url");
  ```
- With Express → Not needed.
  - Query parameters → `req.query`
  - URL parameters → `req.params`

---

## **14. Starting Express Server – Shortcut**

Instead of:

```jsx
const http = require("http");
http.createServer(app).listen(8000);
```

We can simply:

```jsx
app.listen(8000, () => console.log("Running on 8000"));
```

Express **internally** calls `http.createServer()` for us.

---

## **15. ASCII Flow – Express Request Handling**

```
+----------------+
| Client Request |
+-------+--------+
        |
        v
+-------------------------+
| Express Internal Router |
+-----------+-------------+
            |
   Matches PATH & METHOD
            |
            v
+------------------------+
| Route Handler Function |
|  req  → Request data   |
|  res  → Response API   |
+-----------+------------+
            |
            v
+------------------+
| Send Response    |
+------------------+

```

---

## **16. Key Takeaways**

- **Express.js** is not replacing Node’s `http` module — it wraps it to make your life easier.
- Provides **clean routing**, **automatic parsing**, and **middleware support**.
- Makes server code **short, modular, and scalable**.
- Great for both small APIs and large-scale applications.

---

---

## **Express.js One-Page Master Sheet**

### 1. **Setup**

```bash
npm init -y          # Initialize project
npm install express  # Install Express

```

```jsx
const express = require("express");
const app = express();
const PORT = 3000;
```

---

### 2. **Basic Server**

```jsx
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

---

### 3. **Middleware**

```jsx
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Form data
app.use((req, res, next) => {
  // Custom middleware
  console.log(`${req.method} ${req.url}`);
  next();
});
```

---

### 4. **Routes**

```jsx
app.get("/users", (req, res) => {
  res.send("GET Users");
});
app.post("/users", (req, res) => {
  res.send("POST Users");
});
app.put("/users/:id", (req, res) => {
  res.send(`PUT User ${req.params.id}`);
});
app.delete("/users/:id", (req, res) => {
  res.send(`DELETE User ${req.params.id}`);
});
```

---

### 5. **Route Parameters & Query**

```jsx
// URL Param → /user/123
app.get("/user/:id", (req, res) => res.send(req.params.id));

// Query Param → /search?name=Ali
app.get("/search", (req, res) => res.send(req.query.name));
```

---

### 6. **Static Files**

```jsx
app.use(express.static("public")); // Serve static files from /public
```

---

### 7. **Error Handling**

```jsx
app.use((req, res) => res.status(404).send("404 Not Found"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

---

### 8. **Modular Routes**

```jsx
// userRoutes.js
const router = require("express").Router();
router.get("/", (req, res) => res.send("All Users"));
module.exports = router;

// server.js
const userRoutes = require("./userRoutes");
app.use("/users", userRoutes);
```

---

### 9. **CORS**

```jsx
const cors = require("cors");
app.use(cors());
```

---

### 10. **Environment Variables**

```bash
npm install dotenv

```

```jsx
require("dotenv").config();
const PORT = process.env.PORT || 3000;
```

---

✅ **Summary**

- **`express.json()`** → Body parsing (JSON)
- **Routing** → `app.get()`, `app.post()` etc.
- **Static** → Serve public files easily
- **Middleware** → Runs before route handlers
- **Error handling** → Always at bottom
- **Router** → Organize routes into files
- **dotenv** → Keep sensitive data safe

---
