# Express.js Middleware - Complete Guide

## What is Middleware?

**Definition**: Middleware is a function that executes between the client request and server response. It acts as a "middleman" in the request-response cycle.

### Traditional Request Flow:

```
Client → Request → Server Route → Response → Client
```

### With Middleware:

```
Client → Request → Middleware → Server Route → Response → Client
```

## How Middleware Works

### Basic Structure:

```javascript
app.use((req, res, next) => {
  // Middleware code here
  console.log("Hello from middleware");
  next(); // Pass control to next middleware/route
});
```

### Key Components:

- **req**: Request object (incoming data from client)
- **res**: Response object (outgoing data to client)
- **next**: Function to pass control to next middleware

## Middleware Flow Diagram

```
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
│ Client  │───▶│ Middleware 1 │───▶│ Middleware 2 │───▶│ Route       │
│ Request │    │              │    │              │    │ Handler     │
└─────────┘    └──────────────┘    └──────────────┘    └─────────────┘
                       │                    │                   │
                       ▼                    ▼                   ▼
               ┌──────────────┐    ┌──────────────┐    ┌─────────────┐
               │ Process &    │    │ Process &    │    │ Send        │
               │ Call next()  │    │ Call next()  │    │ Response    │
               └──────────────┘    └──────────────┘    └─────────────┘
```

## What Middleware Can Do

1. **Execute any code**
2. **Modify request and response objects**
3. **End the request-response cycle**
4. **Call the next middleware in the stack**

## Middleware Examples

### Example 1: Basic Logging Middleware

```javascript
app.use((req, res, next) => {
  console.log("Hello from middleware one");
  next(); // Must call next() to continue
});

app.get("/users", (req, res) => {
  res.json({ users: [] });
});
```

### Example 2: Multiple Middleware

```javascript
// Middleware 1
app.use((req, res, next) => {
  console.log("Middleware 1 executed");
  next();
});

// Middleware 2
app.use((req, res, next) => {
  console.log("Middleware 2 executed");
  next();
});

// Route handler
app.get("/users", (req, res) => {
  res.json({ message: "All users" });
});
```

### Example 3: Modifying Request Object

```javascript
app.use((req, res, next) => {
  // Add custom property to request
  req.myUsername = "Piyush Garg";
  next();
});

app.get("/users", (req, res) => {
  console.log(req.myUsername); // "Piyush Garg"
  res.json({ users: [] });
});
```

### Example 4: Request Logging to File

```javascript
const fs = require("fs");

app.use((req, res, next) => {
  const logData = `${Date.now()} ${req.method} ${req.url}\n`;

  fs.appendFile("log.txt", logData, (err) => {
    if (err) console.log(err);
    next(); // Continue to next middleware
  });
});
```

## Important Rules

### 1. Always Call next() or End Response

```javascript
// ❌ Wrong - Request will hang
app.use((req, res, next) => {
  console.log("Processing...");
  // Missing next() or res.end()
});

// ✅ Correct - Call next()
app.use((req, res, next) => {
  console.log("Processing...");
  next();
});

// ✅ Correct - End response
app.use((req, res, next) => {
  res.json({ message: "Ended here" });
});
```

### 2. Middleware Order Matters

```javascript
// This runs FIRST
app.use((req, res, next) => {
  console.log("First middleware");
  next();
});

// This runs SECOND
app.use((req, res, next) => {
  console.log("Second middleware");
  next();
});

// This runs LAST
app.get("/users", (req, res) => {
  res.json({ users: [] });
});
```

## Built-in Middleware Examples

### Express URL Encoded (for form data)

```javascript
app.use(express.urlencoded({ extended: true }));
// This parses form data and adds it to req.body
```

## Common Use Cases

1. **Authentication**: Check if user is logged in
2. **Logging**: Record all requests to files
3. **Data Parsing**: Convert form data to JavaScript objects
4. **Security**: Validate requests and block malicious ones
5. **Rate Limiting**: Control request frequency
6. **CORS**: Handle cross-origin requests

## Key Takeaways

- Middleware runs **before** your route handlers
- Use `next()` to pass control to the next middleware
- Middleware can modify `req` and `res` objects
- Changes to `req`/`res` are available in all subsequent middleware
- Without `next()` or response ending, requests will hang
- Order of middleware declaration matters
- Express has many built-in and third-party middleware options

This middleware system makes Express.js very flexible and modular, allowing you to add features as "plugins" to your application.
