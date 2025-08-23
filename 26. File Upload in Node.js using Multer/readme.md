# File Upload in Node.js using Multer

## Overview

This tutorial covers how to implement file upload functionality in Node.js applications using the Multer middleware package.

## Initial Setup

### Basic Express Application Structure

```
project/
├── index.js
├── views/
│   └── index.ejs
└── uploads

```

### Dependencies Required

- **Express**: Web framework for Node.js
- **EJS**: Templating engine for views
- **Multer**: Middleware for handling file uploads

### Basic Server Setup (index.js)

```jsx
const express = require("express");
const path = require("path");

const app = express();
const port = 8000;

// Set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.render("index"); // Renders home page
});

// Server listening
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Frontend Implementation (HTML Form)

### Basic Upload Form Structure

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="profileImage" />
  <button type="submit">Upload</button>
</form>
```

### Key Form Attributes

- **action="/upload"**: Specifies the backend route to handle upload
- **method="POST"**: Uses POST method for file transfer
- **enctype="multipart/form-data"**: **CRITICAL** - Required for file uploads
  - Without this attribute, files won't upload properly
  - Regular forms use different encoding, but files need this specific type

### Form Visual Structure

```
┌─────────────────────────┐
│     Upload Form         │
├─────────────────────────┤
│ [Choose File] [No file] │
│                         │
│      [Upload Button]    │
└─────────────────────────┘

```

## Backend Implementation with Multer

### Step 1: Install Multer

```bash
npm install multer

```

### Step 2: Import and Configure Multer

```jsx
const multer = require("multer");
```

### Step 3: Configure Storage Settings

```jsx
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify upload folder
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    // Create unique filename to prevent overwrites
    const uniqueName = Date.now() + file.originalname;
    cb(null, uniqueName);
  },
});
```

1. `multer.diskStorage()` is used to create a custom storage configuration.
2. The `destination` function decides **which folder** the uploaded file will be saved in.
3. Here, all files are stored inside the `./uploads/` folder.
4. `cb(null, './uploads/')` means no error (null) and save in the `uploads` path.
5. The `filename` function decides the **name of the file** on the server.
6. Using only `file.originalname` can overwrite files with the same name.
7. To avoid this, `Date.now()` (current timestamp) is added before the original name.
8. `const uniqueName = Date.now() + file.originalname;` creates a unique filename.
9. `cb(null, uniqueName)` tells multer to save the file with that name.
10. Final result: every uploaded file is stored in the `uploads/` folder with a **unique name**.

---

### Step 4: Create Upload Instance

```jsx
const upload = multer({ storage: storage });
```

### Step 5: Create Upload Route

```jsx
app.post("/upload", upload.single("profileImage"), (req, res) => {
  console.log(req.body); // Form text data
  console.log(req.file); // Uploaded file information

  res.redirect("/"); // Redirect back to home page
});
```

## Storage Configuration Explained

### Destination Function

- **Purpose**: Defines where uploaded files are stored
- **Parameters**:
  - `req`: Original request object
  - `file`: File being uploaded
  - `cb`: Callback function
- **Usage**: `cb(error, folderPath)`

### Filename Function

- **Purpose**: Defines how uploaded files are named
- **Parameters**: Same as destination function
- **Unique Naming Strategy**: `Date.now() + originalFilename`
  - Prevents file overwrites when multiple users upload files with same names
  - Example: `1234567890photo.jpg` instead of just `photo.jpg`

## File Upload Process Flow

```
User selects file → Form submits → Multer processes → File saved → Response sent
     ↓                    ↓              ↓              ↓            ↓
[Choose File]      [POST /upload]   [Storage Config]  [./uploads/]  [Redirect]

```

## Request Object Properties After Upload

### req.file Contains:

- **originalname**: Original filename from user's computer
- **filename**: New filename assigned by your system
- **path**: Full path where file is stored
- **size**: File size in bytes
- **mimetype**: File type (image/jpeg, application/pdf, etc.)

### req.body Contains:

- Any text form fields (empty if only file upload)

## Multiple File Upload Options

### Single File

```jsx
upload.single("fieldName"); // One file with specific field name
```

### Multiple Files (Same Field)

```jsx
upload.array("fieldName", maxCount); // Multiple files from same input
```

### Multiple Files (Different Fields)

```jsx
upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
```

## Important Notes and Best Practices

### File Naming Strategy

- **Problem**: Users might upload files with identical names
- **Solution**: Append timestamp or unique ID to prevent overwrites
- **Alternative**: Create user-specific folders (e.g., `./uploads/userId/`)

### Folder Structure for Production

```
uploads/
├── user123/
│   ├── profile.jpg
│   └── documents/
└── user456/
    └── resume.pdf

```

### Database Integration

- Store file path in database: `req.file.path`
- Store original filename for display: `req.file.originalname`
- Store file metadata for validation: `req.file.size`, `req.file.mimetype`

### Error Handling

- Always create the uploads folder before running the application
- Handle cases where folder doesn't exist
- Validate file types and sizes as needed

## Common Issues and Solutions

### Error: "ENOENT: no such file or directory"

- **Cause**: Upload folder doesn't exist
- **Solution**: Create the folder manually or programmatically

### Files Not Uploading

- **Check**: Form has `enctype="multipart/form-data"`
- **Check**: Input field name matches Multer configuration
- **Check**: Upload folder has write permissions

## Summary

Multer simplifies file upload handling in Node.js by:

1. Processing multipart form data
2. Providing storage configuration options
3. Handling file naming and organization
4. Making file information available in request object

The key is proper configuration of storage settings and ensuring the frontend form is correctly formatted with the right encoding type.

## Complete Code

### Basic Express Application Structure

```
project/
├── index.js
├── views/
│   └── index.ejs
└── uploads

```

### index.js

```cpp
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname; // unique filename
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("profileimg"), (req, res) => {
  console.log(req.body); // Form text data
  console.log(req.file); // Uploaded file information

  res.redirect("/"); // Redirect back to home page
});

const port = 8000;

app.listen(port, () => console.log(`server running on: `, `localhost:${port}`));

```

### index.ejs

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>file handling</title>
  </head>
  <body>
    <h1>File handling</h1>
    <form method="post" action="/upload" enctype="multipart/form-data">
      <input type="file" name="profileimg" />

      <input type="submit" value="upload" />
    </form>
  </body>
</html>
```
