# REST API & RESTful Backend – Detailed Notes

---

## 1. Introduction

- **Topic**: REST API and RESTful backend development.
- **Focus**: Theory-heavy, but important for building project-based applications.
- **Goal**: Understand **REST principles**, server-client architecture, data handling, and best practices to build scalable APIs.
- **Key Concept**: REST is not just coding; it’s about **designing APIs in a standard, predictable, and maintainable way**.

---

## 2. What is REST API?

- **REST (Representational State Transfer)**:
  - An architectural style for communication between **client** and **server**.
  - Uses **stateless communication** (server doesn’t store client context between requests).
  - explain
    **The selected line "Uses stateless communication (server doesn't store client context between requests)" is a fundamental principle of REST architecture⁠⁠. Let me explain it in detail:**
    **What is stateless communication?**
    **In stateless communication, each request from a client to a server must contain _all_ information needed to understand and process that request.**
    **The server does not retain any information about the client's previous requests.**
    **Each request is treated as an independent transaction, unrelated to previous requests.**
    **What this means in practice:**
    **The server doesn't maintain session state about clients between requests.**
    **Each request must include all authentication and authorization details.**
    **Any data needed to process the request must be included in that request.**
    **Benefits:**
    **Scalability: Servers can handle more clients because they don't need to store session information.**
    **Reliability: If a server fails, requests can be redirected to another server without losing session data.**
    **Simplicity: Each request-response cycle is self-contained and easier to debug.**
    **Example:**
    **In a stateful system, after login, the server might store your identity and permissions.**
    **In a stateless RESTful system, each request must include authentication tokens (like JWT) to identify who you are and what you're allowed to do.**
    **This principle is essential for creating scalable, distributed systems that align with REST architectural principles⁠**
- **RESTful API**:
  - An API that follows REST rules and **industry best practices**.
  - Standardizes how clients interact with server resources.
  - **Resource-based**: Everything is considered a resource (e.g., user, blog, product).

**Key Takeaways**:

- REST provides **guidelines**, not strict rules.
- Industry has some **de facto standards** for RESTful API design.

---

## 3. Client-Server Architecture

- **Server**: Stores and manages data. Performs processing.
- **Client**: Requests data. Can be a browser, mobile app, IoT device, Alexa, etc.
- **Communication Flow**:
  - Client → sends **request**
  - Server → sends **response**

**ASCII Visual:**

```
+----------------+    Request     +----------------+
|     Client     |  ------------> |     Server     |
| (Browser/App)  | <------------  | (Database/API) |
+----------------+    Response    +----------------+

```

- **Principle**: Server and client must be **independent**:
  - Server does **not** know how client will display data.
  - Client does **not** directly access the database.
  - Server only provides **raw or structured data**.

---

## 4. Data Formats

- **Server can send**:
  1. **Text** – Simple text messages.
  2. **Image** – For media-based APIs.
  3. **HTML Document** – Pre-rendered pages.
  4. **JSON** – Recommended for REST APIs.

### JSON (JavaScript Object Notation)

- Structure: Key-value pairs.
- Platform-independent: Can be read by browsers, mobile apps, or IoT devices.
- Example:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### HTML Response

- **Server-Side Rendering (SSR)**:
  - Server generates **HTML page** before sending it.
  - Client just displays the page.
  - Fast for browsers.
- **Client-Side Rendering (CSR)**:
  - Server sends **JSON data**.
  - Client (React/Flutter app) renders the page.
  - Flexible for cross-platform apps, slightly slower.

**ASCII Comparison:**

```
SSR (Server-Side Rendering)       CSR (Client-Side Rendering)
+--------+                        +--------+
| Server |  HTML  --> Browser     | Server |
|  DB    |                        |  DB    |
+--------+                        +--------+
                                    |
                                    v
                                Browser/App renders JSON

```

---

## 5. REST Principles – Important Rules

1. **Client-Server Separation**
   - Server handles **data & logic**.
   - Client handles **UI & presentation**.
   - **Benefit**: Can change client or server independently.
2. **Stateless Communication**
   - Each request contains all information needed.
   - Server **does not store session info**.
3. **Use Standard HTTP Methods**
   - Each method has a specific **intent**:

| Method | Purpose                      | Example                          |
| ------ | ---------------------------- | -------------------------------- |
| GET    | Retrieve data                | GET /users → fetch all users     |
| POST   | Create new data              | POST /users → create a new user  |
| PATCH  | Update part of existing data | PATCH /users/1 → update email    |
| PUT    | Replace existing data        | PUT /users/1 → replace user info |
| DELETE | Remove data                  | DELETE /users/1 → delete user    |

- **Best Practice**: Respect method purpose.
- **Common Mistake**: Using GET or POST for all operations → confusing and non-standard.

---

## 6. HTML vs JSON Use Cases

### 6.1 When to use HTML

- Only if client is **fixed as a browser**.
- Example: `google.com` → always browser → send pre-rendered HTML.
- Advantage: Fast, no extra rendering needed.

### 6.2 When to use JSON

- Cross-platform clients (mobile, React app, IoT devices).
- Server sends raw data, **client decides rendering**.
- Example:

```jsx
res.json({ title: "REST API Tutorial", author: "Hamza" });
```

- **Rendering**: Client converts JSON → UI dynamically.

**ASCII Flow:**

```
[Browser Client] --> SSR HTML --> Display page directly
[React/Mobile Client] --> JSON --> Client renders dynamically

```

---

## 7. Example: Server Routes & RESTful Methods

### 7.1 GET Request

- Route: `GET /users`
- Action: Fetch all users.
- Example:

```jsx
app.get("/users", (req, res) => {
  res.json(users); // send JSON data
});
```

### 7.2 POST Request

- Route: `POST /users`
- Action: Create a new user.
- Example:

```jsx
app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json(newUser);
});
```

### 7.3 PATCH Request

- Route: `PATCH /users/:id`
- Action: Update existing user partially.

### 7.4 DELETE Request

- Route: `DELETE /users/:id`
- Action: Remove user.

---

## 8. Server-Side vs Client-Side Rendering – Detailed Comparison

| Feature     | SSR                       | CSR                       |
| ----------- | ------------------------- | ------------------------- |
| Rendering   | Server                    | Client (browser/app)      |
| Data format | HTML                      | JSON                      |
| Speed       | Faster                    | Slightly slower           |
| Flexibility | Low (HTML tied to server) | High (JSON used anywhere) |
| Example Use | Static websites, Google   | React apps, mobile apps   |

**ASCII Visualization:**

```
SSR:
[Client] <-- HTML <-- [Server] <-- DB
CSR:
[Client] <-- JSON <-- [Server] <-- DB
         Client renders data dynamically

```

---

## 9. Summary of REST Best Practices

1. Always **follow client-server separation**.
2. Respect **HTTP methods** (GET, POST, PATCH, DELETE).
3. Send **HTML** only for browser-only clients (fast).
4. Send **JSON** for cross-platform rendering.
5. Keep server **stateless**.
6. Use proper **status codes**: 200, 201, 404, 500, etc.

---

## 10. Next Steps

- Start coding **Express.js server** using above principles.
- First: HTML responses for browser clients.
- Later: JSON responses for React or mobile clients.
- Respect HTTP methods strictly to keep API RESTful.

---

✅ **Key Concept Recap**:

- REST = **rules + best practices** for client-server interaction.
- Separation of concerns = **server does logic, client does rendering**.
- HTML = SSR (browser), JSON = CSR (cross-platform).
- HTTP methods must match their intended action.

---

---

```
                 ┌───────────────────────────┐
                 │         CLIENTS            │
                 │  (Browser, Mobile, IoT)    │
                 └───────────┬────────────────┘
                             │
               ┌─────────────┼─────────────────┐
               │ HTTP REQUEST │                 │
               └─────────────┼─────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │             SERVER (API)             │
          │      (Express.js / REST Backend)     │
          └─────────────────┬────────────────────┘
                             │
          ┌──────────────────┼───────────────────┐
          │   Check HTTP Method & Route           │
          │   ────────────────────────────        │
          │   GET    → Retrieve data               │
          │   POST   → Create data                 │
          │   PATCH  → Update data (partial)       │
          │   DELETE → Remove data                 │
          └──────────────────┼───────────────────┘
                             │
          ┌──────────────────▼───────────────────┐
          │           DATABASE / DATA STORE       │
          │ (MongoDB, PostgreSQL, MySQL, etc.)    │
          └──────────────────┬───────────────────┘
                             │
          ┌──────────────────▼───────────────────┐
          │        FETCH / UPDATE / DELETE        │
          └──────────────────┬───────────────────┘
                             │
     ┌───────────────────────┼────────────────────────┐
     │                       │                         │
┌────▼─────┐           ┌─────▼─────┐           ┌──────▼──────┐
│ Render   │           │ Send JSON │           │ Status Code │
│ HTML     │           │ Response  │           │ (200, 201…) │
│ (SSR)    │           │ (CSR)     │           │ Error codes │
└────┬─────┘           └─────┬─────┘           └──────┬──────┘
     │                       │                         │
     ▼                       ▼                         ▼
BROWSER ONLY           CROSS-PLATFORM           CLIENT KNOWS
(fast load)            (Browser/Mobile)         RESULT STATUS
HTML page              Dynamic rendering        Success/Error

```

---

### **How the Flow Works**

### **1. GET Request** (Retrieve Data)

```
Client → GET /users → Server → DB → Data →
[HTML for SSR or JSON for CSR] → Client

```

### **2. POST Request** (Create Data)

```
Client → POST /users (JSON body) → Server → DB Insert →
JSON (new resource) → Client

```

### **3. PATCH Request** (Update Part of Data)

```
Client → PATCH /users/:id → Server → DB Update →
JSON (updated fields) → Client

```

### **4. DELETE Request** (Remove Data)

```
Client → DELETE /users/:id → Server → DB Delete →
Status Code 204 (No Content) → Client

```

---

### **Key Points from Diagram**

- **Separation of Concerns**:
  - Server decides whether to send **HTML** (SSR) or **JSON** (CSR).
  - Database only stores/manages data, never formats it.
- **HTTP Methods are respected** for clear and predictable APIs.
- **Status Codes** give clients info about request result without needing HTML.

---
