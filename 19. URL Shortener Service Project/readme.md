# URL Shortener Service

## Overview

Building a URL shortening service (like Bitly) that converts long URLs into shorter, shareable links and tracks analytics.

## What is a URL Shortener?

- **Purpose**: Takes long URLs and creates shorter versions
- **Example**: `https://example.com/very/long/url` → `https://short.ly/abc123`
- **Popular Services**: Bitly, TinyURL, etc.

## Core Features to Build

1. **URL Shortening**: Generate short IDs for long URLs
2. **Redirection**: Redirect users from short URL to original URL
3. **Analytics**: Track total visits and visit history
4. **Visit Tracking**: Record timestamps of each visit

---

## Project Setup

### 1. Initialize Project

```bash
npm init
npm install express mongoose
npm install shortid  # For generating short IDs
npm install nodemon  # For development

```

### 2. Project Structure

```
short-url/
├── index.js          # Main server file
├── models/
│   └── url.js        # URL data model
├── controllers/
│   └── url.js        # Business logic
├── routes/
│   └── url.js        # API routes
└── connect.js        # Database connection

```

---

## Database Design (MongoDB)

### URL Schema

```jsx
// models/url.js
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
    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("URL", urlSchema);
```

**Schema Explanation**:

- `shortId`: Unique identifier for the short URL
- `redirectURL`: Original long URL to redirect to
- `visitHistory`: Array storing visit timestamps
- `timestamps`: Auto-generated creation/update times

---

## API Endpoints

### 1. Generate Short URL

**POST** `/url`

**Request Body**:

```json
{
  "url": "https://example.com/very/long/url"
}
```

**Response**:

```json
{
  "id": "abc123"
}
```

### 2. Redirect to Original URL

**GET** `/:shortId`

- Redirects user to original URL
- Records visit in database

### 3. Get Analytics

**GET** `/url/analytics/:shortId`

**Response**:

```json
{
  "totalClicks": 5,
  "analytics": [{ "timestamp": 1640995200000 }, { "timestamp": 1640995300000 }]
}
```

---

## Implementation Details

### 1. Main Server File (index.js)

```jsx
const express = require("express");
const connectToMongoDB = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;

// Middleware
app.use(express.json());

// Database connection
connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

// Routes
app.use("/url", urlRoute);

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

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
```

### 2. URL Controller (controllers/url.js)

```jsx
const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;

  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
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

### 3. Routes (routes/url.js)

```jsx
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

### 4. Database Connection (connect.js)

```jsx
const mongoose = require("mongoose");

async function connectToMongoDB(url) {
  return mongoose.connect(url);
}

module.exports = connectToMongoDB;
```

---

## How It Works - Flow Diagram

```
ASCII Flow Diagram:

User Request → Server → Generate Short ID → Store in DB → Return Short URL
     ↓
User clicks Short URL → Server finds Original URL → Update Visit History → Redirect
     ↓
Analytics Request → Server → Query DB → Return Visit Stats

```

**Detailed Flow**:

1. **URL Shortening**:
   - User sends POST request with long URL
   - Server generates unique short ID using `shortid`
   - Stores mapping in MongoDB
   - Returns short ID to user
2. **URL Redirection**:
   - User visits short URL
   - Server extracts short ID from URL
   - Finds original URL in database
   - Records visit timestamp
   - Redirects user to original URL
3. **Analytics**:
   - User requests analytics for short ID
   - Server queries database
   - Returns total clicks and visit history

---

## Key Technical Concepts

### Short ID Generation

- **Library Used**: `shortid`
- **Purpose**: Creates unique, URL-safe identifiers
- **Length**: Configurable (default ~8 characters)
- **Uniqueness**: Ensured by MongoDB unique constraint

### Database Operations

- **Create**: Store new URL mappings
- **Update**: Add visit records using `$push`
- **Query**: Find URLs by short ID

### Express.js Features Used

- **Middleware**: JSON parsing
- **Route Parameters**: Extract short ID from URL
- **HTTP Methods**: GET, POST
- **Response Methods**: JSON, redirect

---

## Testing the API

### Using Postman

1. **Create Short URL**:

   ```
   POST http://localhost:8001/url
   Body: { "url": "https://google.com" }

   ```

2. **Visit Short URL**:

   ```
   GET http://localhost:8001/abc123

   ```

3. **Get Analytics**:

   ```
   GET http://localhost:8001/url/analytics/abc123

   ```

---

## Potential Enhancements

### Additional Features

- **User Authentication**: Associate URLs with users
- **Custom Short IDs**: Allow users to choose custom IDs
- **Expiration Dates**: Set URL expiry times
- **Click Analytics**: Track user IP, location, device info
- **QR Code Generation**: Create QR codes for short URLs

### Performance Improvements

- **Caching**: Use Redis for frequently accessed URLs
- **Rate Limiting**: Prevent abuse
- **URL Validation**: Verify URLs before shortening

---

## Common Issues & Solutions

### Database Connection Issues

- Ensure MongoDB is running on port 27017
- Check database name in connection string

### Short ID Conflicts

- `shortid` library handles uniqueness
- MongoDB unique constraint provides additional safety

### Missing Dependencies

- Install all required packages: `express`, `mongoose`, `shortid`, `nodemon`

---

## Next Steps

- Build user interface (UI)
- Add user authentication
- Implement advanced analytics
- Deploy to production server

This URL shortener provides a solid foundation for understanding how services like Bitly work behind the scenes!
