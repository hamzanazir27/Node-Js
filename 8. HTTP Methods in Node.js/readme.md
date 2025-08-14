# HTTP Methods in Node.js - Complete Guide

## What are HTTP Methods?

HTTP methods are different types of requests that tell the server what action you want to perform:

- **GET** - Retrieve data from server
- **POST** - Send new data to server
- **PUT** - Upload/replace data on server
- **PATCH** - Update/modify existing data
- **DELETE** - Remove data from server

---

## 1. GET Method

### Purpose

- Used to **retrieve/fetch data** from the server
- Most commonly used method
- Browser always makes GET requests by default

### When to Use

- Loading web pages
- Fetching user profiles
- Getting search results
- Any time you need to read data

### Example

```
Browser URL: youtube.com/search
↓
Server receives GET request
↓
Server reads data from database
↓
Server sends data back to client

```

### Proof in Browser

1. Open browser developer tools (F12)
2. Go to **Network** tab
3. Visit any website
4. You'll see all requests are **GET** type
5. Request shows: Method: GET, URL: website.com

---

## 2. POST Method

### Purpose

- Used to **send new data** to the server
- Creates new entries in database
- Used for forms and user input

### When to Use

- User registration/signup
- Login forms
- Creating new posts
- Submitting any form data

### Example

```
User fills signup form:
- Username: john
- Email: john@email.com
- Password: 123456
↓
Form submits POST request
↓
Server receives data in request body
↓
Server creates new user in database

```

### Real Example - Facebook Login

- Fill login form with email/password
- Click "Log In" button
- Browser sends POST request to facebook.com
- Form data is sent in request body
- Server processes login attempt

---

## 3. PUT Method

### Purpose

- Used to **upload or replace** data on server
- Commonly used for file uploads

### When to Use

- Uploading profile pictures
- Uploading documents
- Replacing entire resources

---

## 4. PATCH Method

### Purpose

- Used to **update/modify existing data**
- Changes specific fields of existing records

### When to Use

- Editing user profile
- Updating post content
- Changing settings

---

## 5. DELETE Method

### Purpose

- Used to **remove data** from server
- Deletes records from database

### When to Use

- Deleting user account
- Removing posts
- Clearing data

---

## Handling HTTP Methods in Node.js

### Basic Server Structure

```jsx
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("Request method:", req.method);

  // Handle different methods
  if (req.method === "GET") {
    res.end("You are on home page");
  }
});

server.listen(8000);
```

### Handling Multiple Routes and Methods

```jsx
// Handle /signup route
if (req.url === "/signup") {
  if (req.method === "GET") {
    // Show signup form
    res.end("This is signup form");
  }

  if (req.method === "POST") {
    // Process form data
    // Save to database
    res.end("Success - User created");
  }
}
```

### Method Flow Diagram

```
Client Request
     ↓
┌─────────────┐
│   GET?      │ → Show page/data
├─────────────┤
│   POST?     │ → Create new data
├─────────────┤
│   PUT?      │ → Upload/replace
├─────────────┤
│   PATCH?    │ → Update existing
├─────────────┤
│   DELETE?   │ → Remove data
└─────────────┘
     ↓
Server Response

```

---

## Key Takeaways

### Most Common Methods

- **GET** - Get data (90% of web requests)
- **POST** - Send form data (login, signup, etc.)

### Method Rules

- **GET**: Never sends data in body, only in URL parameters
- **POST**: Sends data in request body (more secure)
- **Browser default**: Always GET when typing URL
- **Forms**: Can use both GET and POST methods

### Why Use Express.js?

Raw Node.js method handling becomes complex with many routes. Express framework makes it much easier:

```jsx
// Instead of complex if/else chains
app.get("/signup", handler);
app.post("/signup", handler);
app.put("/upload", handler);
```

This provides better code structure and maintainability for production applications.

---

### **`server.js`**

```jsx
const http = require("http");

const server = http.createServer((req, res) => {
  // CORS aur JSON handle karne ke liye
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    // Example: /home
    res.end(JSON.stringify({ message: "GET request - Data fetch kiya" }));
  } else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.end(
        JSON.stringify({ message: "POST request - Data receive hua", data })
      );
    });
  } else if (req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.end(
        JSON.stringify({ message: "PUT request - Pura data replace hua", data })
      );
    });
  } else if (req.method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.end(
        JSON.stringify({
          message: "PATCH request - Partially update hua",
          data,
        })
      );
    });
  } else if (req.method === "DELETE") {
    res.end(JSON.stringify({ message: "DELETE request - Data delete hua" }));
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ message: "Method not allowed" }));
  }
});

// Server start
server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
```

---

### **Kaise test karein**

1. File ko save karo `server.js` naam se.
2. Terminal me run karo:

   ```bash
   node server.js

   ```

3. Test karne ke liye **Postman** ya **curl** ka use karo:
   - **GET:**
     ```bash
     curl http://localhost:8000

     ```
   - **POST:**
     ```bash
     curl -X POST -H "Content-Type: application/json" -d '{"name":"Hamza"}' http://localhost:8000

     ```
   - **PUT:**
     ```bash
     curl -X PUT -H "Content-Type: application/json" -d '{"name":"New Name"}' http://localhost:8000

     ```
   - **PATCH:**
     ```bash
     curl -X PATCH -H "Content-Type: application/json" -d '{"email":"test@example.com"}' http://localhost:8000

     ```
   - **DELETE:**
     ```bash
     curl -X DELETE http://localhost:8000

     ```

---

Agar tum chaho to main iska **Express.js version** bhi de sakta hoon jo zyada short aur clean hota hai.

Kya tum chahte ho main Express wala version bana doon?
