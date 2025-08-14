# Building an HTTP Web Server with Node.js

## Overview

This tutorial covers creating a basic HTTP web server using Node.js built-in modules. It's a beginner-level guide that explains the fundamental concepts of server creation.

## Prerequisites

- Basic understanding of Node.js
- Terminal/Command line access
- Text editor or IDE

## Step 1: Project Setup

### Initialize Project

```bash
npm init

```

- Creates a package.json file with basic configuration
- Accept default values by pressing Enter for each prompt

### Create Main File

- Create `index.js` file
- **Best Practice**: Always name the main file as `index.js`
  - Makes it easy for developers to identify the entry point
  - Standard convention in Node.js projects

## Step 2: Basic Server Creation

### Import HTTP Module

```jsx
const http = require("http");
```

- `http` is a built-in Node.js module
- No need for external installation
- Used to create web servers

### Create Server Instance

```jsx
const myServer = http.createServer();
```

- `createServer()` function creates a new HTTP server
- Returns a server instance that can handle requests

## Step 3: Request Handler Function

### Add Request Listener

```jsx
const myServer = http.createServer((req, res) => {
  console.log("New request received");
  res.end("Hello from server");
});
```

### Understanding Parameters

- **req (Request Object)**: Contains information about incoming request
  - User's IP address
  - Browser information
  - Headers
  - URL path
  - HTTP method
- **res (Response Object)**: Used to send response back to client

## Step 4: Server Listening

### Start Server on Port

```jsx
myServer.listen(8000, () => {
  console.log("Server started");
});
```

### Understanding Ports

- **Port**: Like a door to your server
- Each server needs a unique port number
- Common development ports: 8000, 8001, 3000
- Only one server can run on a specific port at a time

## Step 5: Package.json Script

### Add Start Script

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

### Run Server

```bash
npm start

```

## Step 6: Testing the Server

### Access Server

- Open browser
- Navigate to: `http://localhost:8000`
- Should display: "Hello from server"

### Server Behavior

- Each browser request triggers the callback function
- Console shows "New request received"
- Browser displays the response message

## Step 7: Working with Request Data

### Accessing Request Headers

```jsx
const myServer = http.createServer((req, res) => {
  console.log(req.headers);
  res.end("Hello from server");
});
```

### Request Information Available

- **Headers**: Extra information about the request
- **URL**: The path being requested
- **Method**: GET, POST, etc.
- **IP Address**: Client's location
- **User Agent**: Browser/client information

## Step 8: Adding Logging Functionality

### File System Integration

```jsx
const fs = require("fs");
const http = require("http");

const myServer = http.createServer((req, res) => {
  // Create log entry
  const log = `${Date.now()}: New request received\n`;

  // Append to log file (non-blocking)
  fs.appendFile("log.txt", log, (err) => {
    if (err) console.log(err);
  });

  res.end("Hello from server again");
});
```

### Important Notes

- **Use non-blocking operations**: `appendFile()` instead of `appendFileSync()`
- **Why non-blocking?**: Prevents server from getting stuck
- **Thread Pool**: Blocking operations can exhaust available threads

## Step 9: URL Routing

### Basic Routing with Switch Case

```jsx
const myServer = http.createServer((req, res) => {
  const url = req.url;

  switch (url) {
    case "/":
      res.end("This is Home Page");
      break;
    case "/about":
      res.end("I am Piyush Garg");
      break;
    default:
      res.end("404 Not Found");
      break;
  }
});
```

### URL Patterns

- `/` = Home page
- `/about` = About page
- `/contact` = Contact page
- Default case handles undefined routes (404 errors)

## Step 10: Enhanced Logging with Path Information

```jsx
const myServer = http.createServer((req, res) => {
  const log = `${Date.now()}: ${req.url} New request received\n`;

  fs.appendFile("log.txt", log, (err) => {
    if (err) console.log(err);
  });

  // Handle routing
  switch (req.url) {
    case "/":
      res.end("Home Page");
      break;
    case "/about":
      res.end("About Page");
      break;
    default:
      res.end("404 Not Found");
      break;
  }
});
```

## Key Concepts Summary

### Server Architecture

```
Client Request → HTTP Module → Request Handler → Response
                      ↓
                 Log to File (Non-blocking)

```

### Best Practices

1. **Always use non-blocking operations** in request handlers
2. **Avoid CPU-intensive tasks** in the main thread
3. **Use consistent file naming** (index.js for entry point)
4. **Implement proper error handling**
5. **Log requests** for monitoring and debugging

### Performance Considerations

- **Non-blocking I/O**: Prevents server from hanging
- **Event Loop**: Node.js handles concurrent requests efficiently
- **Thread Pool**: Limited threads available for blocking operations
- **CPU-intensive tasks**: Should be avoided in request handlers

## Server Restart Requirements

- **Manual restart needed** for code changes
- **Process**: Stop server (Ctrl+C) → Make changes → Restart server
- **Future improvement**: Use nodemon for automatic restart

## Next Steps

- Learn Express.js framework for easier server development
- Implement more advanced routing
- Add middleware functionality
- Handle different HTTP methods (GET, POST, PUT, DELETE)
- Serve static files and HTML pages

This tutorial provides the foundation for understanding how web servers work internally in Node.js before moving to higher-level frameworks like Express.js.

---

---

```cpp
// ============================
// 1) Required Modules
// ============================

// 'http' module Node.js ka built-in module hai jo HTTP server banane ke liye use hota hai
const http = require('http');

// 'fs' (file system) module ka use files read/write karne ke liye hota hai
const fs = require('fs');

// ============================
// 2) Create Server
// ============================

// createServer ek HTTP server banata hai
// Iske andar ek callback function hota hai jo HAR request pe chal jata hai
// 'req' (request) → client (browser ya API consumer) ki taraf se aayi request ka data
// 'res' (response) → jo server client ko wapas bhejega (HTML, JSON, text, etc.)
const server = http.createServer((req, res) => {

    // --- Step A: Debugging ke liye console me request ka info print karte hain
    console.log("📩 New request received");
    console.log("URL:", req.url); // Example: "/", "/about"
    console.log("Method:", req.method); // Example: GET, POST
    console.log("IP Address:", req.socket.remoteAddress); // Client ka IP

    // ============================
    // 3) Logging request in file
    // ============================
    // Har request ka ek record bana ke log.txt me append karte hain
    const log = `${new Date().toISOString()} | ${req.method} ${req.url} | IP: ${req.socket.remoteAddress}\n`;

    // appendFile non-blocking hai → baaki kaam rukta nahi
    fs.appendFile('log.txt', log, (err) => {
        if (err) console.error("❌ Error writing log:", err);
    });

    // ============================
    // 4) Routing - Different URLs ke liye alag-alag responses
    // ============================

    // Home page (GET request, path "/")
    if (req.url === '/' && req.method === 'GET') {
        // writeHead → status code + headers bhejte hain
        // 'Content-Type' = text/plain → means plain text bhej rahe hain
        res.writeHead(200, { 'Content-Type': 'text/plain' }); // 200 = OK
        res.end("Welcome to the Home Page!"); // Response body
    }

    // About page (GET request, path "/about")
    else if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("This is the About Page.");
    }

    // Contact page (GET request, path "/contact")
    else if (req.url === '/contact' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Contact us at: contact@example.com");
    }

    // Agar koi unknown URL aaye → 404 Not Found
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' }); // 404 = resource not found
        res.end("404 Not Found");
    }
});

// ============================
// 5) Start Server
// ============================

// Port number define karte hain (yahan 8000)
const PORT = 8000;

// Server ko start karte hain
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

/*
=============================================================
    ASCII VISUAL FLOW OF REQUEST & RESPONSE
=============================================================

  [ Browser / Client ]
           |
           | 1) User types "http://localhost:8000/about"
           v
    -----------------------
    |  Node.js HTTP Server |
    -----------------------
           |
           | 2) Server receives request (req.url = "/about", req.method = "GET")
           |
           +--> [ Check Route ] -----------------------------+
                 |                                           |
         [ "/" && GET ] --> Home Page Response                |
         [ "/about" && GET ] --> About Page Response          |
         [ "/contact" && GET ] --> Contact Page Response      |
                 |                                           |
                 +--> Else --> Send 404 Not Found Response   |

           |
           | 3) Response sent back to Browser (res.end())
           v
  [ Browser shows text on screen ]

=============================================================
    FILE LOGGING FLOW
=============================================================

  Incoming Request
          |
          v
  Create log string:
  "2025-08-12T10:15:30Z | GET /about | IP: ::1"
          |
          v
  Append to "log.txt"
          |
          v
  File keeps history of all requests

=============================================================
*/

```

```cpp
=============================================================
 FRONTEND (React App) + BACKEND (Node.js HTTP Server) FLOW
=============================================================

  [ USER ACTION ]
       |
       | 1) User opens browser & goes to React app (e.g. http://localhost:3000)
       v
  ---------------------------------------------------
  | React App (Frontend) - Browser runs JavaScript  |
  ---------------------------------------------------
       |
       | 2) React component mounts → useEffect() runs
       |
       | 3) fetch("http://localhost:8000/about") or axios.get(...)
       v
  ---------------------------------------------------
  | HTTP REQUEST (from Browser)                     |
  ---------------------------------------------------
       |
       | 4) Browser sends HTTP GET request:
       |    Method: GET
       |    URL: http://localhost:8000/about
       |    Headers: Accept, Content-Type, etc.
       v
  ---------------------------------------------------
  | Node.js HTTP Server (Backend)                   |
  ---------------------------------------------------
       |
       | 5) Server receives request:
       |    req.method = "GET"
       |    req.url = "/about"
       |
       | 6) Server checks routing:
       |    if "/about" && GET → Send "This is the About Page."
       v
  ---------------------------------------------------
  | HTTP RESPONSE                                   |
  ---------------------------------------------------
       |
       | 7) Response:
       |    Status: 200 OK
       |    Body: "This is the About Page."
       |
       | 8) Response travels back to Browser
       v
  ---------------------------------------------------
  | React App receives response data                |
  ---------------------------------------------------
       |
       | 9) .then(res => res.text()) or res.json()
       |    → Store in state variable
       |
       | 10) React re-renders component with new data
       v
  ---------------------------------------------------
  | UI updates & user sees the result on screen     |
  ---------------------------------------------------

=============================================================
  SIMPLE TIMELINE OF EVENTS
=============================================================

  USER → React fetch() → HTTP Request → Node.js Server
  → Server processes → HTTP Response → React updates UI → USER sees data

=============================================================

```
