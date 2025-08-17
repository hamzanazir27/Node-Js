# MongoDB Database

## Introduction

This lesson covers **MongoDB** - a popular NoSQL database that's perfect for Node.js applications.

---

## What is MongoDB?

### Key Characteristics

- **NoSQL Database**: Does not use traditional table structure
  • **Document-Based**: Stores data in JSON-like format (BSON)
  • **Best for Node.js**: Excellent compatibility with Node.js applications
  • **Flexible Schema**: No fixed table structure required

### MongoDB vs SQL Database

```
SQL Database         │  MongoDB
─────────────────────┼──────────────────────
Tables               │  Collections
Rows                 │  Documents
Columns              │  Fields
Structured Schema    │  Flexible Schema

```

---

## MongoDB Architecture

### Basic Structure

```
Database
├── Collection 1 (like a table)
│   ├── Document 1 (like a row)
│   ├── Document 2
│   └── Document 3
├── Collection 2
│   ├── Document 1
│   └── Document 2
└── Collection 3

```

### Real Example

```
Social Media App Database
├── Users Collection
│   ├── {name: "John", email: "john@email.com", age: 25}
│   ├── {name: "Jane", email: "jane@email.com", age: 28}
│   └── {name: "Bob", email: "bob@email.com", age: 30}
├── Posts Collection
│   ├── {title: "My First Post", content: "Hello World", userId: "123"}
│   └── {title: "Another Post", content: "MongoDB is great!", userId: "456"}
└── Comments Collection
    ├── {text: "Great post!", postId: "789", userId: "123"}
    └── {text: "Thanks for sharing", postId: "789", userId: "456"}

```

---

## Installation Guide

### For Mac Users

### Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

```

### Step 2: Add MongoDB Repository

```bash
brew tap mongodb/brew

```

### Step 3: Update Homebrew

```bash
brew update

```

### Step 4: Install MongoDB

```bash
brew install mongodb-community@6.0

```

⚠️ **Note**: This installation can take 25-30 minutes depending on internet speed.

### For Windows Users

### Step 1: Download Installer

- Go to: `google.com` → Search "MongoDB install"
  • Click: "Install MongoDB Community Edition"
  • Select: Windows option
  • Download the `.msi` file

### Step 2: Run Installer

- Double-click the `.msi` file
  • Follow the installation wizard (Next → Next → Agree)
  • Complete the installation

---

## Starting MongoDB

### Start MongoDB Service

```bash
brew services start mongodb-community@6.0

```

### Connect to MongoDB Shell

```bash
mongosh

```

**Expected Output:**

```
MongoDB shell version v6.0.1
connecting to: mongodb://127.0.0.1:27017

```

---

## Basic MongoDB Commands

### 1. Show All Databases

```jsx
show dbs

```

**Output Example:**

```
admin     40.00 KiB
config    12.00 KiB
local     40.00 KiB
test      8.00 KiB

```

### 2. Select/Create Database

```jsx
use myDatabase

```

### 3. Show Collections in Current Database

```jsx
show collections

```

### 4. View Documents in Collection

```jsx
db.collectionName.find();
```

**Example:**

```jsx
db.users.find();
```

### 5. Insert Document into Collection

```jsx
db.collectionName.insertOne({ key: "value" });
```

**Example:**

```jsx
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 25,
});
```

---

## Sample MongoDB Session

### Complete Workflow Example

```jsx
// 1. Show available databases
show dbs

// 2. Switch to 'myapp' database
use myapp

// 3. Check collections in current database
show collections

// 4. Insert a new user
db.users.insertOne({
  name: "Alice Smith",
  email: "alice@email.com",
  age: 28,
  city: "New York"
})

// 5. View all users
db.users.find()

// 6. Insert a post
db.posts.insertOne({
  title: "My First Blog Post",
  content: "Learning MongoDB is fun!",
  author: "Alice Smith",
  createdAt: new Date()
})

// 7. View all posts
db.posts.find()

```

---

## Document Structure Example

### User Document

```jsx
{
  "_id": ObjectId("64a1b2c3d4e5f6789012345"),
  "name": "John Doe",
  "email": "john@example.com",
  "age": 25,
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zipcode": "02101"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "createdAt": ISODate("2024-01-15T10:30:00Z")
}

```

### Key Features of Documents:

- **\_id**: Unique identifier (auto-generated)
  • **Nested Objects**: Address can be an object inside user
  • **Arrays**: Hobbies stored as array of strings

• **Multiple Data Types**: Strings, numbers, booleans, dates
• **No Fixed Schema**: Each document can have different fields

---

## Next Steps Preview

### What's Coming Next:

- **Connect MongoDB to Node.js Application**
  • **Replace JSON file storage with MongoDB**
  • **Implement CRUD operations** (Create, Read, Update, Delete)
  • **User management with database persistence**
  • **Build complete projects with MongoDB**

### Benefits After Integration:

- **Persistent Data**: Data survives server restarts
  • **Scalable**: Handle thousands of records efficiently
  • **Professional Setup**: Production-ready database solution
  • **Advanced Queries**: Search, filter, and sort data easily

---

## Troubleshooting Tips

### Common Issues:

- **Installation taking too long**: Normal for large package, wait patiently
  • **Command not found**: Restart terminal after installation
  • **Permission errors**: Use `sudo` for Mac/Linux installations
  • **Service not starting**: Check if MongoDB is properly installed

### Verification Commands:

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Check MongoDB version
mongod --version

# Test connection
mongosh --eval "db.runCommand({hello:1})"

```

---

## Key Takeaways

- **MongoDB is a NoSQL database** perfect for modern web applications
  • **Collections contain documents** (similar to tables containing rows)
  • **Documents are flexible** - no rigid schema required
  • **BSON format** allows complex data structures
  • **Easy integration** with Node.js applications
  • **Scalable solution** for growing applications

---

_Note: MongoDB installation steps may vary slightly based on system updates. Always refer to the official MongoDB documentation for the latest installation instructions._

---

# My MongoDB Setup Journey (with Errors & Fixes)

## 1. Downloading MongoDB

- First, I went to the official MongoDB download page:
  👉 https://www.mongodb.com/try/download/community
- I downloaded **MongoDB Community Server** (latest version available for Windows).
- During installation, I chose **Complete Setup** and also installed **MongoDB Compass** (GUI for MongoDB).

---

## 2. Verifying Installation

- After installation, I opened **Command Prompt (CMD)** and typed:
  ```bash
  mongod --version

  ```
  ✔️ It showed MongoDB version (which means installation was successful).
- Then I tried:
  ```bash
  mongosh

  ```
  ❌ Got this error:
  ```
  MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017

  ```
  This meant **MongoDB service was not running**.

---

## 3. Fixing MongoDB Service Issue

- I checked if MongoDB service was installed by running in CMD:
  ```bash
  services.msc

  ```
  - Found that MongoDB was **not running**.
- Solution:
  - I reinstalled MongoDB (with the option **Install MongoDB as a Service** enabled).
  - After reinstall, I started MongoDB manually in CMD:
    ```bash
    net start MongoDB

    ```
  - This time, the service started successfully.

---

## 4. Running Mongo Shell

- After service was running, I opened CMD and typed:
  ```bash
  mongosh

  ```
  ✔️ Successfully connected to `mongodb://127.0.0.1:27017`.

---

## 5. Creating and Switching Database

- I created a new database called **myDB**:
  ```bash
  use myDB

  ```
  Output:
  ```
  switched to db myDB

  ```
- Then I tried to see databases:
  ```bash
  show myDB

  ```
  ❌ Got error:
  ```
  MongoshInvalidInputError: [COMMON-10001] 'myDB' is not a valid argument for "show".

  ```
- Correct command was:
  ```bash
  show dbs

  ```
  or
  ```bash
  db

  ```
  ✔️ This showed the list of databases.

---

## 6. Warnings Faced

When starting MongoDB, I also got this warning:

```
Access control is not enabled for the database.
Read and write access to data and configuration is unrestricted.

```

👉 This means **authentication (username/password)** is not enabled.

Solution (for later): Setup MongoDB users with roles if security is required.

Reference: [MongoDB Enable Access Control](https://www.mongodb.com/docs/manual/tutorial/enable-authentication/)

---

# ✅ Final Notes

- Installed MongoDB from official site.
- Faced **connection refused error** → fixed by enabling and starting MongoDB service.
- Switched to database `myDB` using `use myDB`.
- Faced **invalid show command error** → corrected by using `show dbs`.
- Warning about **access control** → to be fixed later by creating users.

---
