# Server-Side Rendering with EJS Template Engine - Complete Guide

## What is Server-Side Rendering (SSR)?

**Server-Side Rendering** is a technique where HTML pages are generated and rendered on the server before being sent to the client's browser.

### Basic Example:

```
app.get('/test', (req, res) => {
    return res.send('<h1>From Server</h1>');
});

```

## The Problem with Manual HTML Generation

### Issues with Direct HTML in Routes:

- Writing complete HTML in route handlers is impractical
- Difficult to maintain large applications
- Server becomes cluttered with HTML code
- Not scalable for multiple routes and complex UIs

### Example of the Problem:

```jsx
// This becomes unmanageable for large applications
let html = `
<html>
  <head></head>
  <body>
    <ol>
      ${allUrls
        .map((url) => `<li>${url.shortId} - ${url.visitHistory.length}</li>`)
        .join("")}
    </ol>
  </body>
</html>
`;
```

## Solution: Templating Engines

**Templating engines** solve server-side rendering problems by separating HTML structure from server logic.

### Popular Templating Engines:

- **EJS** (Embedded JavaScript Templating)
- **Pug** (formerly Jade)
- **Handlebars**
- **JSP** (JavaServer Pages)

## Setting Up EJS with Express

### Step 1: Installation

```bash
npm install ejs

```

### Step 2: Configure Express Application

```jsx
// Import required modules
const express = require("express");
const path = require("path");
const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");

// Set views directory location
app.set("views", path.resolve("./views"));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
```

### Project Structure:

```
project-root/
├── views/
│   ├── home.ejs
│   └── other-templates.ejs
├── routes/
│   └── staticRouter.js
├── models/
├── index.js
└── package.json

```

## Creating EJS Templates

### Basic EJS Template Structure (home.ejs):

```html
<!DOCTYPE html>
<html>
  <head>
    <title>URL Shortener</title>
    <style>
      body {
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>URL Shortener</h1>

    <!-- Form for creating short URLs -->
    <div>
      <form method="POST" action="/url">
        <label>Enter your original URL:</label>
        <input type="text" name="url" required />
        <button type="submit">Generate</button>
      </form>
    </div>

    <!-- Show generated URL if exists -->
    <% if (locals.id) { %>
    <p>URL Generated: http://localhost:8001/<%= id %></p>
    <% } %>

    <!-- Display all URLs in a table -->
    <% if (locals.urls) { %>
    <table border="1">
      <thead>
        <tr>
          <th>Serial Number</th>
          <th>Short ID</th>
          <th>Redirect URL</th>
          <th>Clicks</th>
        </tr>
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
  </body>
</html>
```

## EJS Syntax Guide

### Key EJS Tags:

- `<% %>` - Execute JavaScript code (no output)
- `<%= %>` - Output variable value (escaped)
- `<%- %>` - Output raw HTML (unescaped)

### Examples:

```
<!-- Conditional rendering -->
<% if (condition) { %>
    <p>This shows when condition is true</p>
<% } %>

<!-- Loop through array -->
<% array.forEach((item, index) => { %>
    <li><%= item.name %></li>
<% }) %>

<!-- Access passed variables -->
<%= variableName %>

```

## Route Implementation

### Static Router Setup (staticRouter.js):

```jsx
const express = require("express");
const URL = require("../models/url");
const router = express.Router();

// Home page route
router.get("/", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

// Handle URL creation
router.post("/url", async (req, res) => {
  const { url } = req.body;

  // Create short URL logic here
  const shortUrl = await URL.create({
    shortId: generateShortId(),
    redirectURL: url,
    visitHistory: [],
  });

  const allUrls = await URL.find({});
  return res.render("home", {
    id: shortUrl.shortId,
    urls: allUrls,
  });
});

module.exports = router;
```

### Main Application Setup (index.js):

```jsx
const express = require("express");
const connectToMongoDB = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url"); // <-- yahan import karna zaroori hai
const path = require("path");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = 8001;
app.use(express.json()); // JSON body ke liye
app.use(express.urlencoded({ extended: true })); // form data ke liye

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

app.use("/url", urlRoute);
app.use("/", staticRouter);

//get all
app.get("/test", async (req, res) => {
  const allUrls = await URL.find();
  return res.render("home", {
    urls: allUrls,
  });
});

// Redirect route
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
```

## Data Flow Visualization

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│   Express Route  │───▶│   EJS Template  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Final HTML     │◀───│   Template Data  │◀───│   Server Logic  │
│  (Client)       │    │   (Variables)    │    │   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘

```

## Key Benefits of Using EJS

### Advantages:

- **Separation of Concerns**: HTML structure separate from server logic
- **Dynamic Content**: Easy variable interpolation and conditionals
- **Maintainability**: Cleaner, more organized code
- **Reusability**: Templates can be reused across different routes
- **Built-in Security**: Automatic HTML escaping prevents XSS attacks

### Best Practices:

- Keep templates in a dedicated `views` directory
- Use meaningful variable names when passing data
- Leverage conditionals for dynamic rendering
- Use loops for repetitive content (tables, lists)
- Include error handling for missing data

## Complete Working Example

This setup creates a functional URL shortener with:

1. **Form submission** for creating short URLs
2. **Dynamic table** showing all URLs with click counts
3. **Conditional rendering** for success messages
4. **Server-side processing** with database integration

### Final Result:

- Users can submit original URLs
- System generates short URLs
- Table displays all URLs with statistics
- Click tracking functionality
- Clean, maintainable code structure

The final HTML is rendered on the server and sent as a complete page to the client, making it SEO-friendly and fast-loading.
