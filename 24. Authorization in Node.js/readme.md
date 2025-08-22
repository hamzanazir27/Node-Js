# URL Shortener with Authentication & Authorization

A Node.js application that provides URL shortening functionality with user authentication and role-based authorization.

## Features

- **URL Shortening**: Create short URLs from long URLs
- **User Authentication**: Sign up, login, and logout functionality
- **Role-Based Authorization**: Admin and normal user roles
- **URL Analytics**: Track click history and visit statistics
- **Secure Password Storage**: Passwords are hashed using bcrypt
- **JWT Token Authentication**: Secure session management using cookies

## Project Structure

```
├── controllers/          # Business logic handlers
│   ├── url.js          # URL shortening logic
│   └── user.js         # User authentication logic
├── middlewares/         # Express middleware
│   └── auth.js         # Authentication & authorization middleware
├── models/             # Database models
│   ├── url.js          # URL schema
│   └── users.js        # User schema
├── routes/             # Route definitions
│   ├── url.js          # URL-related routes
│   ├── user.js         # User-related routes
│   └── staticRouter.js # Static page routes
├── services/           # Business services
│   └── auth.js         # JWT token management
├── views/              # EJS templates
├── connect.js          # MongoDB connection
├── index.js            # Main application file
└── package.json        # Dependencies and scripts
```

## Issues Found and FixedAdded `bcrypt` dependency to package.json

### 2. Missing Function Definition

- **Issue**: `generateShortId` function was called but not defined in `staticRouter.js`
- **Fix**: Imported `shortid` package and used it directly

### 3. Critical Middleware Error (RESOLVED)

- **Issue**: `TypeError: argument handler must be a function` on line 33 of index.js
- **Root Cause**: The `restrictTo` function in `middlewares/auth.js` was declared as `async` but Express expects synchronous middleware functions
- **Fix**: Removed `async` keyword from `restrictTo` function
- **Error Details**:
  ```
  TypeError: argument handler must be a function
  at Function.use (router/index.js:392:13)
  at Object.<anonymous> (index.js:33:5)
  ```

### 4. Inconsistent URL Creation Logic

- **Issue**: Different URL creation logic between `staticRouter.js` and `url.js`
- **Fix**: Standardized URL creation with proper user association and error handling

### 5. Missing Password Security

- **Issue**: Passwords were stored in plain text
- **Fix**: Implemented bcrypt password hashing with salt rounds

### 6. Poor Error Handling

- **Issue**: Missing try-catch blocks and proper error responses
- **Fix**: Added comprehensive error handling throughout the application

### 7. Missing Logout Functionality

- **Issue**: No way for users to log out
- **Fix**: Added logout route and controller function

### 8. Incomplete Admin Route Handling

- **Issue**: Admin routes were not properly configured
- **Fix**: Restructured admin routing with proper middleware

### 9. Missing Input Validation

- **Issue**: No validation for URL format or user input
- **Fix**: Added basic URL validation and input sanitization

### 10. Package.json Issues

- **Issue**: Poor project metadata and missing start script
- **Fix**: Improved package.json with better description, keywords, and scripts

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Make sure MongoDB is running on `localhost:27017`
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### User Routes

- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `GET /user/logout` - User logout

### URL Routes

- `POST /url` - Create new short URL
- `GET /url/analytics/:shortId` - Get URL analytics

### Static Routes

- `GET /` - Home page (requires authentication)
- `GET /signup` - Signup page
- `GET /login` - Login page
- `GET /admin` - Admin dashboard (admin only)

## Environment Variables

- `PORT` - Server port (default: 8001)
- MongoDB connection string (hardcoded to `mongodb://localhost:27017/short-url`)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Secure cookie handling
- Input validation and sanitization

## Dependencies

### Core Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `ejs` - Template engine
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cookie-parser` - Cookie parsing
- `shortid` - Short ID generation

### Development Dependencies

- `nodemon` - Development server with auto-reload

## API Endpoints

### Authentication

- `POST /user/signup` - Register new user
- `POST /user/login` - Authenticate user
- `GET /user/logout` - Logout user

### URL Management

- `POST /url` - Create short URL
- `GET /url/analytics/:shortId` - Get URL statistics
- `GET /:shortId` - Redirect to original URL

### Pages

- `GET /` - Dashboard (authenticated)
- `GET /signup` - Registration page
- `GET /login` - Login page
- `GET /admin` - Admin panel (admin only)

## Database Models

### User Model

- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (normal/admin)
- `timestamps` - Creation and update times

### URL Model

- `redirectURL` - Original long URL
- `visitHistory` - Array of visit timestamps
- `createdBy` - User who created the URL
- `timestamps` - Creation and update times

## Middleware

### Authentication Middleware

- `checkForAuthentication` - Verifies JWT tokens and sets user context
- `restrictTo` - Role-based access control

## Error Handling

The application now includes comprehensive error handling:

- Database connection errors
- Authentication failures
- Authorization denials
- Invalid input validation
- Internal server errors
- 404 Not Found handling

## Future Improvements

1. Add password reset functionality
2. Implement rate limiting
3. Add URL expiration dates
4. Implement URL categories/tags
5. Add bulk URL import/export
6. Implement URL preview functionality
7. Add user profile management
8. Implement API rate limiting
9. Add comprehensive logging
10. Implement unit and integration tests

## License

---

# Authentication vs Authorization in Node.js

## Key Definitions

**Authentication**: Verifying who a user is (like checking if they have a valid membership card to enter a club)

**Authorization**: Checking if an authenticated user has permission to access specific resources (like checking if they can enter the kitchen area of the club)

---

## Code Refactoring: Creating Clean Middleware

### Problem with Original Code

- Repeated authentication logic across multiple routes
- Not following good coding practices
- Hard to maintain

### Solution: Create Reusable Middleware Functions

### 1. Authentication Middleware (`checkForAuthentication`)

```jsx
function checkForAuthentication(req, res, next) {
  // Get authorization header value
  const authorizationHeaderValue = req.headers.authorization;

  // Check if authorization header exists and starts with "Bearer"
  if (
    !authorizationHeaderValue ||
    !authorizationHeaderValue.startsWith("Bearer")
  ) {
    req.user = null;
    return next();
  }

  // Extract token from header
  const token = authorizationHeaderValue.split(" ")[1];

  // Validate token using authentication service
  const user = getUser(token);

  if (!user) {
    return next();
  }

  // Attach user to request object
  req.user = user;
  return next();
}
```

### 2. Authorization Middleware (`restrictTo`)

```jsx
function restrictTo(roles) {
  return function (req, res, next) {
    // Check if user is authenticated
    if (!req.user) {
      return res.redirect("/login");
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(401).send("Unauthorized");
    }

    return next();
  };
}
```

---

## Database Schema Updates

### Adding Role Field to User Model

```jsx
// User Schema
{
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        default: 'normal'
    }
}

```

### Migration: Update Existing Users

```bash
# MongoDB command to add role field to existing users
db.users.updateMany({}, { $set: { role: 'normal' } })

```

---

## Implementation Flow

### Route Protection Setup

```jsx
// Apply authentication middleware globally
app.use(checkForAuthentication);

// Protect specific routes with authorization
app.get("/", restrictTo(["normal", "admin"]), (req, res) => {
  // Show user's own URLs only
});

app.get("/admin/urls", restrictTo(["admin"]), (req, res) => {
  // Show all URLs for admin users
});
```

### Cookie-Based Authentication

```jsx
// Extract token from cookies instead of headers
function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;

  if (!tokenCookie) {
    req.user = null;
    return next();
  }

  const user = getUser(tokenCookie);
  req.user = user;
  return next();
}
```

---

## Visual Flow Diagram

```
USER REQUEST
     ↓
┌─────────────────────┐
│ checkForAuthentication │
│  - Extract token      │
│  - Validate user      │
│  - Set req.user       │
└─────────────────────┘
     ↓
┌─────────────────────┐
│   restrictTo        │
│  - Check if logged  │
│  - Check user role  │
│  - Allow/Deny       │
└─────────────────────┘
     ↓
┌─────────────────────┐
│   Route Handler     │
│  - Execute logic    │
│  - Send response    │
└─────────────────────┘

```

---

## Role-Based Access Example

### User Roles:

- **normal**: Can view own URLs only
- **admin**: Can view all URLs and user information

### Route Access Matrix:

| Route         | Normal User     | Admin       |
| ------------- | --------------- | ----------- |
| `/`           | ✅ Own URLs     | ✅ Own URLs |
| `/admin/urls` | ❌ Unauthorized | ✅ All URLs |

---

## Token Updates

### Including Role in JWT Token

```jsx
// When creating token, include user role
const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
    role: user.role, // Add role to token payload
  },
  SECRET_KEY
);
```

---

## Key Takeaways

- **Separation of Concerns**: Authentication and authorization are separate middleware functions
- **Reusability**: One middleware can be used across multiple routes
- **Flexibility**: Easy to add new roles and permissions
- **Security**: Proper token validation and role checking
- **Maintainability**: Clean, readable code structure

---
