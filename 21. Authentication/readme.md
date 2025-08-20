# Token-Based Authentication (Stateless Authentication)

## Overview

This video explains **token-based authentication** (also called **stateless authentication**) and how it solves problems with traditional session-based authentication.

---

## Problems with Stateful Authentication

### Issues:

- **State Loss**: When server restarts, all users get logged out
- **Memory Intensive**: Server must store session data for each user
- **Limited Scalability**: Server memory is finite

```
Stateful Authentication Problem:
┌─────────────────┐    ┌──────────────────┐
│     Client      │    │      Server      │
│                 │    │   ┌──────────┐   │
│   Session ID    │◄───┤   │ Sessions │   │
│   DL1234567     │    │   │ Storage  │   │
│                 │    │   └──────────┘   │
└─────────────────┘    └──────────────────┘
                              ↓
                       Server Restart =
                       All Sessions Lost!

```

---

## Stateless Authentication Solution

### Key Concept:

- **No server-side state** - all user information stored in the token itself
- **Self-contained tokens** - like a parking ticket with all details written on it
- **Signed tokens** - protected from tampering (like currency notes)

### Token Analogy:

Think of it like an ID card:

- Contains your information (name, ID number, etc.)
- Has an official stamp/signature
- Anyone can read it, but nobody can forge it without the official stamp

---

## JWT (JSON Web Tokens)

### What is JWT?

**JSON Web Token** - A secure way to transmit information between parties as a JSON object

### JWT Structure:

```
Token Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUGl5dXNoIiwiX2lkIjoiMTIzIn0.signature

Decoded Payload:
{
  "name": "Piyush",
  "_id": "123"
}

```

---

## Implementation Steps

### 1. Setup

```jsx
// Install jsonwebtoken
npm install jsonwebtoken

// Import in authentication service
const jwt = require('jsonwebtoken');

```

### 2. Creating Tokens

```jsx
// Create payload with user data
const payload = {
  _id: user._id,
  email: user.email,
};

// Sign token with secret key
const token = jwt.sign(payload, "your-secret-key-here");

// Send token as cookie
response.cookie("token", token);
```

### 3. Verifying Tokens

```jsx
// Get token from request
const token = request.cookies.token;

// Verify token
try {
  const decoded = jwt.verify(token, "your-secret-key-here");
  return decoded; // Contains user data
} catch (error) {
  return null; // Invalid token
}
```

---

## Security Considerations

### Secret Key Importance:

- **Must be kept secure** - only server should know it
- **Complex and unique** - example: `PiAyUsH$123@`
- **Never share publicly** - anyone with secret key can create valid tokens

### Token Security:

- **Never share tokens publicly** - they contain user authentication
- **Treat like passwords** - if leaked, attackers can impersonate users
- **Have expiration times** - tokens should not last forever

---

## Comparison: Stateful vs Stateless

```
STATEFUL (Session-Based):
┌─────────────┐    ┌──────────────────┐
│   Client    │    │      Server      │
│             │    │                  │
│ Session ID  │◄──►│ Session Storage  │
│   abc123    │    │ {user data...}   │
└─────────────┘    └──────────────────┘
                     Memory Required

STATELESS (Token-Based):
┌─────────────┐    ┌──────────────────┐
│   Client    │    │      Server      │
│             │    │                  │
│ JWT Token   │◄──►│   No Storage     │
│{user data}  │    │  (Verifies only) │
└─────────────┘    └──────────────────┘
                     No Memory Required

```

### Advantages of Stateless:

- **Server restart proof** - user stays logged in
- **Memory efficient** - no server-side storage
- **Scalable** - works well with multiple servers
- **Serverless friendly** - perfect for modern cloud applications

---

## Use Cases

### When to Use Tokens (Stateless):

- **Social media applications**
- **API services**
- **Long-term sessions**
- **Serverless applications**
- **Mobile applications**

### When to Use Sessions (Stateful):

- **Banking websites** (need short-term sessions)
- **High-security applications**
- **Applications requiring frequent logout**

---

## Practical Demo Results

### Testing Token Security:

1. **Valid token** → User authenticated successfully
2. **Modified token** → Authentication fails
3. **Server restart** → User remains logged in (unlike sessions)
4. **Token with wrong secret** → Authentication fails

### Key Takeaway:

Only the server with the correct secret key can create and verify valid tokens, making the system secure while being stateless.

---

## Important Notes

⚠️ **Security Warnings:**

- Never log or display actual JWT tokens in production
- Store secret keys securely (environment variables)
- Implement token expiration
- Use HTTPS in production
- Rotate secret keys periodically

📝 **Best Practices:**

- Keep tokens as small as possible
- Don't store sensitive data in tokens (they're readable)
- Implement proper error handling
- Use standard JWT libraries, don't build your own
