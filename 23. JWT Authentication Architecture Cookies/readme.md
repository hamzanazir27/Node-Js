# JWT Authentication Architecture: Cookies vs Headers

## Introduction

This covers JWT (JSON Web Token) authentication architecture, specifically how tokens are transmitted between client and server using two main approaches: cookies and headers.

## Key Concept: Database Sessions Issue

**Problem with storing sessions in database:**

- Every request requires a database query to authenticate users
- Increases read operations significantly
- Higher costs (you pay for each database read/write)
- Added latency (300ms+ depending on database location)
- Not efficient for authentication purposes

**Solution:** Use JWT tokens that contain user information, eliminating need for database queries on every request.

---

## Method 1: Cookie-Based Authentication

### How Cookies Work

```
Client Browser    →    Server    →    Database
     ↓                    ↓
   Cookie Storage    Token Creation
     ↓                    ↓
Auto-send with     Verify & Extract
every request      user information

```

### Step-by-Step Process

1. **User Login:**
   - User sends username/password to server
   - Server validates credentials against database
   - Server creates JWT token with user information (ID, email, name)
2. **Cookie Creation:**
   - Server creates cookie using `response.cookie()`
   - Cookie contains the JWT token
   - Example: `response.cookie('uid', token)`
3. **Browser Behavior:**
   - Browser automatically stores cookies
   - Cookies are automatically sent with every request to the same domain
   - No manual intervention required
4. **Authentication Check:**
   - Server checks if 'uid' cookie exists in incoming requests
   - Validates the token inside the cookie
   - Extracts user information from validated token

### Cookie Properties

- **Domain-specific:** Cookies only sent to the domain that created them
  - Facebook cookies only go to Facebook
  - Google cookies only go to Google domains
- **Expiration:** Can set expiry dates
- **Path-specific:** Can limit to specific URL paths
- **Secure by default:** Browser handles security

### Advantages

- Automatic transmission with requests
- Browser handles storage and security
- Works across subdomains (e.g., gmail.com → youtube.com)

### Disadvantages

- **Browser-only:** Won't work in mobile apps
- Limited to web applications
- Less control over token transmission

---

## Method 2: Header-Based Authentication

### How Headers Work

```
Client App       →       Server
     ↓                     ↓
Manual Storage      Extract from Header
(localStorage,      Authorization: Bearer
device storage)     <token_value>
     ↓                     ↓
Manual sending      Validate Token
in every request

```

### Step-by-Step Process

1. **User Login:**
   - User sends credentials
   - Server validates and creates JWT token
   - Server sends token in JSON response: `{token: "jwt_token_here"}`
2. **Client Storage:**
   - Client responsible for storing token
   - Web apps: localStorage or sessionStorage
   - Mobile apps: device storage/keychain
   - Desktop apps: secure storage
3. **Request Authentication:**
   - Client manually adds Authorization header to each request
   - Format: `Authorization: Bearer <token>`
   - Server extracts token from header
4. **Server Processing:**

   ```jsx
   // Extract token from header
   const authHeader = request.headers.authorization;
   const token = authHeader.split(" ")[1]; // Remove 'Bearer ' prefix
   // Validate token
   ```

### Authorization Header Standard

- **Header name:** `Authorization`
- **Format:** `Bearer <token>`
- **Bearer:** Indicates token-based authentication
- **Standard approach:** Follows HTTP specifications

### Advantages

- Works with any type of application (web, mobile, desktop)
- More flexibility in token handling
- No automatic transmission (more secure)
- Cross-platform compatibility

### Disadvantages

- Manual implementation required
- Client responsible for secure storage
- Must manually include header in each request

---

## Comparison: Cookies vs Headers

| Aspect                        | Cookies               | Headers          |
| ----------------------------- | --------------------- | ---------------- |
| **Automatic sending**         | ✅ Yes                | ❌ Manual        |
| **Mobile app support**        | ❌ No                 | ✅ Yes           |
| **Web app support**           | ✅ Yes                | ✅ Yes           |
| **Implementation complexity** | ✅ Simple             | ❌ More complex  |
| **Security control**          | ❌ Browser controlled | ✅ Full control  |
| **Cross-platform**            | ❌ Browser only       | ✅ All platforms |

---

## Implementation Examples

### Cookie Implementation

```jsx
// Server-side: Create cookie
response.cookie("uid", jwtToken, {
  domain: ".example.com",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
  httpOnly: true,
});

// Server-side: Verify cookie
const token = request.cookies.uid;
if (token) {
  // Validate token
  const user = jwt.verify(token, secretKey);
}
```

### Header Implementation

```jsx
// Client-side: Send request with header
fetch("/api/protected", {
  headers: {
    Authorization: `Bearer ${storedToken}`,
  },
});

// Server-side: Extract and verify
const authHeader = request.headers.authorization;
if (authHeader && authHeader.startsWith("Bearer ")) {
  const token = authHeader.split(" ")[1];
  const user = jwt.verify(token, secretKey);
}
```

---

## Visual Architecture

```
Authentication Flow:

1. COOKIE METHOD:
   User → Server (login) → Database (verify) → JWT Token
                    ↓
   Browser ← Cookie (auto-stored) ← Server
                    ↓
   Future Requests: Browser → (cookie auto-sent) → Server

2. HEADER METHOD:
   User → Server (login) → Database (verify) → JWT Token
                    ↓
   Client ← JSON Response ← Server
                    ↓
   Client Storage (manual)
                    ↓
   Future Requests: Client → (manual header) → Server

```

---

## Key Takeaways

1. **Database efficiency:** JWT tokens eliminate need for database queries on every authentication check
2. **Choose based on application type:**
   - Web-only applications: Cookies are simpler
   - Multi-platform applications: Headers are necessary
3. **Security considerations:** Both methods are secure when implemented correctly
4. **Standard compliance:** Use `Authorization: Bearer <token>` for header-based approach
5. **Token storage:** Client applications must securely store tokens when using header method

---

##Changed file

```
  //file \23. JWT Authentication Architecture Cookies\middlewares\auth.js
const { use } = require("../routes/url");
const { getUser } = require("../services/auth");

async function restrictTOUserLoginOnly(req, res, next) {
  // const token = req.cookies.token;
  const userid = req.headers["Authorization"];
  if (!userid) return res.redirect("/login");
  const token = userid.split("Bearer ")[1];
  const result = getUser(token);
  if (!result || !result.user) return res.redirect("/login");

  req.user = result.user;
  next();
}

async function checkAuth(req, res, next) {
  const userid = req.headers["authorization"];
  const token = userid.split("Bearer ")[1];

  // Handle case where token doesn't exist
  if (!token) {
    req.user = null;
    return next();
  }

  // Handle case where getUser returns null
  const result = getUser(token);
  if (!result) {
    req.user = null;
    return next();
  }

  req.user = result.user;
  next();
}

module.exports = { restrictTOUserLoginOnly, checkAuth };





```
