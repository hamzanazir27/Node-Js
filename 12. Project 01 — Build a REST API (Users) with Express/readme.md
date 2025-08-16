# Project 01 — Build a REST API (Users) with Express

## 0) Big Picture

- **Goal**: Design a **RESTful API** that follows best practices and returns **JSON** for API clients.
- **Hybrid idea**:
  - `/users` → returns **HTML** (SSR) for a browser preview
  - `/api/users` → returns **JSON** (CSR) for apps (React/Mobile/IoT)

---

## 1) Quick Definitions (in plain words)

- **REST (Representational State Transfer)**: A style of designing APIs using standard HTTP methods and stateless communication.
- **RESTful**: You _respect_ HTTP methods (GET/POST/PATCH/DELETE), clean URLs, and stateless requests.
- **SSR (Server-Side Rendering)**: Server sends ready-to-show **HTML**.
- **CSR (Client-Side Rendering)**: Server sends **JSON**, client renders UI.
- **Path parameter**: Variable part in URL like `/users/:id` (e.g., `/users/42`).
- **Mock data**: Fake data for testing (e.g., from Mockaroo).

---

## 2) Project Setup (Node + Express)

> Corrected commands & tips (fixing minor mistakes from the talk)

- Initialize project:
  ```
  npm init -y

  ```
- Install Express:
  ```
  npm i express

  ```
  > (Typical stable major: 4.18.x — not “4.88.x”)
- Create `index.js` with boilerplate:
  ```jsx
  const express = require("express");
  const app = express();
  const PORT = 8000;

  // Important for POST/PATCH JSON bodies
  app.use(express.json());

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  ```
- Add script in `package.json`:
  ```json
  "scripts": { "start": "node index.js" }

  ```

---

## 3) Prepare Mock Data (Users)

- Use **Mockaroo** (correct site: _mockaroo.com_) to generate **1000 users** with fields like:
  - `id` (Number), `first_name`, `last_name`, `email`, `gender`, `job_title`
- Download as **JSON**, save in project (e.g., `users.json`).
- Import data:
  ```jsx
  const users = require("./users.json");
  ```

---

## 4) Route Plan (Task List)

- **HTML (SSR) for browsers**
  - `GET /users` → render a simple HTML list of users
- **JSON (API) for cross-platform**
  - `GET /api/users` → list all users
  - `GET /api/users/:id` → get user by id
  - `POST /api/users` → create new user
  - `PATCH /api/users/:id` → update part of user
  - `DELETE /api/users/:id` → delete user by id

---

## 5) Implement: GET All & GET by ID (JSON API)

### `GET /api/users` → all users

```jsx
app.get("/api/users", (req, res) => {
  res.json(users);
});
```

### `GET /api/users/:id` → one user (dynamic path param)

```jsx
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id); // convert from string
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});
```

**Why `:id`?** It declares a **dynamic path parameter**.

---

## 6) Implement: HTML (SSR) Preview

### `GET /users` → HTML list

```jsx
app.get("/users", (req, res) => {
  const items = users
    .map((u) => `<li>${u.first_name} ${u.last_name}</li>`)
    .join("");
  const html = `<ul>${items}</ul>`;
  res.send(html); // send HTML to browser
});
```

- Great for quickly previewing data in a browser.
- Keeps `/api/*` strictly JSON for API clients.

---

## 7) Grouping Routes for One Path

Use `app.route()` to avoid repeating `/api/users/:id` for multiple methods:

```jsx
app
  .route("/api/users/:id")
  .get((req, res) => {
    /* return one user */
  })
  .patch((req, res) => {
    /* update partial fields */
  })
  .delete((req, res) => {
    /* delete user */
  });
```

Benefits:

- Cleaner, less duplication
- Easier to maintain

---

## 8) POST, PATCH, DELETE (placeholders → then finalize with Postman)

> Browsers send GET by default; use Postman/Thunder Client/cURL to test POST/PATCH/DELETE.

```jsx
// create user
// when evt post request handle select on postman body > x-www-form-urlencoded
// and use this middleware
const { urlencoded } = require("body-parser");
app.use(urlencoded({ extended: false }));

app.post("/api/users", (req, res) => {
  // validate req.body, generate id, push to array
  // example skeleton:
  // const { first_name, last_name, email } = req.body;
  // const id = users.length ? users[users.length-1].id + 1 : 1;
  // const newUser = { id, first_name, last_name, email };
  // users.push(newUser);
  // res.status(201).json(newUser);
  res.status(501).json({ status: "pending" }); // placeholder
});

// update partial fields
app.patch("/api/users/:id", (req, res) => {
  res.status(501).json({ status: "pending" }); // placeholder
});

// delete user
app.delete("/api/users/:id", (req, res) => {
  res.status(501).json({ status: "pending" }); // placeholder
});
```

> Remember: express.json() middleware is required to read JSON request bodies.

---

## 9) Status Codes (quick guide)

- **200 OK** (GET success)
- **201 Created** (POST success)
- **204 No Content** (DELETE success, no body)
- **400 Bad Request** (invalid input)
- **404 Not Found** (resource missing)
- **500 Internal Server Error** (unexpected error)

---

## 10) ASCII Visuals

### A) Hybrid Server (HTML + JSON)

```
           +------------------+
           |      Client      |
           |  Browser / App   |
           +---------+--------+
                     |
              HTTP Requests
                     |
        +------------v-------------+
        |         Express          |
        |     (Node.js Server)     |
        +------+-----------+-------+
               |           |
        HTML (SSR)      JSON (API)
          /users         /api/users
               |           |
           Renders      Data as JSON
          <ul><li>...    [ {...}, {...} ]
               |
         +-----v-----+           +------v------+
         |  Browser  |           |  Any Client |
         |  (HTML)   |           | React/Mobile|
         +-----------+           +-------------+

```

### B) REST Endpoints Map

```
/users                     -> HTML list (SSR)
/api/users                 -> GET: list all (JSON)
              (id)        -> GET: /api/users/:id
              (create)    -> POST: /api/users
              (partial)   -> PATCH: /api/users/:id
              (delete)    -> DELETE: /api/users/:id

```

### C) Dynamic Path Parameter Flow (`/api/users/:id`)

```
Request: GET /api/users/7
               |
               v
     req.params.id === "7"
               |
          Number("7") -> 7
               |
     find user where user.id === 7
               |
        Found? yes -> res.json(user)
               no  -> res.status(404).json({error:"User not found"})

```

### D) Method Handling for One Path (Route Grouping)

```
app.route('/api/users/:id')
    ├─ GET     -> read one user
    ├─ PATCH   -> update partial fields
    └─ DELETE  -> remove user

```

---

## 11) Best Practices Recap

- Use `/api/...` for JSON endpoints; reserve plain paths for HTML pages.
- Respect **HTTP methods** (GET/POST/PATCH/DELETE).
- Keep **stateless** requests; include all info in each request.
- Validate input, return meaningful **status codes** and **error messages**.
- Prefer **route grouping** (`app.route`) to reduce duplication.
- Add `express.json()` to parse JSON bodies for POST/PATCH.

---

## 12) What was corrected/clarified

- Site name: **Mockaroo** (not “mokalo”).
- Express version example: **4.18.x** (not “4.88.2”).
- Added required middleware: `app.use(express.json())`.
- Emphasized testing non-GET methods with **Postman** (browser can’t send POST/PATCH/DELETE directly by URL bar).

---

Got it — you want a **single `index.js` file** Express demo that has:

- In-memory data store (so no DB setup)
- Basic **Create**, **Read**, **Update**, and **Delete** routes
- Immediately runnable (`node index.js`)
- Testable via Postman

Here’s the complete file:

```jsx
// index.js
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// ===== In-memory "database" =====
let items = [
  { id: 1, name: "Apple", price: 100 },
  { id: 2, name: "Banana", price: 50 },
];
let nextId = 3;

// ===== Routes =====

// Read all items
app.get("/items", (req, res) => {
  res.json(items);
});

// Read one item
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// Create item
app.post("/items", (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: "Name and price required" });
  }
  const newItem = { id: nextId++, name, price };
  items.push(newItem);
  res.status(201).json(newItem);
});

// Update item
app.put("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });

  const { name, price } = req.body;
  if (name) item.name = name;
  if (price != null) item.price = price;

  res.json(item);
});

// Delete item
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Item not found" });

  const deleted = items.splice(index, 1);
  res.json(deleted[0]);
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

### How to run

1. Install dependencies:

   ```bash
   npm init -y
   npm install express

   ```

2. Save the code above in `index.js`.
3. Run:

   ```bash
   node index.js

   ```

4. Test in Postman:

| Method | URL                             | Body (JSON)                       | Description     |
| ------ | ------------------------------- | --------------------------------- | --------------- |
| GET    | `http://localhost:3000/items`   | —                                 | Get all items   |
| GET    | `http://localhost:3000/items/1` | —                                 | Get one item    |
| POST   | `http://localhost:3000/items`   | `{"name": "Mango", "price": 120}` | Create new item |
| PUT    | `http://localhost:3000/items/1` | `{"price": 150}`                  | Update item     |
| DELETE | `http://localhost:3000/items/1` | —                                 | Delete item     |

---

# REST API Notes — Implementing **POST**, **PATCH**, **DELETE** and Testing with **Postman**

---

## 1) What we’re building

- A small REST API (using **Express.js**) for `users`.
- Endpoints return:
  - **HTML** at `/users` (server-rendered demo list).
  - **JSON** at `/api/users` (actual API).
- CRUD coverage:
  - `GET /api/users` → list all users
  - `GET /api/users/:id` → get one user
  - `POST /api/users` → create user
  - `PATCH /api/users/:id` → update some fields
  - `DELETE /api/users/:id` → remove user

---

## 2) Tools

- **Node.js + npm**
- **Express** (web framework)
- **Postman** (free, for API testing and quick docs)

---

## 3) High-level flow (ASCII visual)

```
+-----------+        HTTP (GET/POST/PATCH/DELETE)         +------------------+
|  Client   |  <--------------------------------------->  |   Express Server  |
| (Postman) |                                            / |  index.js        |
+-----------+                                           /  +------------------+
                                                       /       |    |
                                                      /        |    +--> Router/Handlers
                                                     /         |           (users)
                                                    /          v
                                            +---------------+  +------------------+
                                            | Middleware    |  | In-Memory Store  |
                                            | - express.json|  |  users[]         |
                                            | - urlencoded  |  |  (and optional   |
                                            +---------------+  |   mock-data.json)|
                                                    \          +------------------+
                                                     \               |
                                                      \              v
                                                       \       +-----------+
                                                        \----->| Response  |
                                                               | HTML/JSON |
                                                               +-----------+

```

---

## 4) Postman basics (testing your API)

- Create a **New Request** (➕ tab).
- Choose method: `GET`, `POST`, `PATCH`, `DELETE`.
- Enter URL like `http://localhost:8000/api/users` (note: **HTTP**, not HTTPS).
- Click **Send**.
- Inspect:
  - **Status** (e.g., `200 OK`, `201 Created`).
  - **Time** (in **ms**, milliseconds).
  - **Size** (approx response bytes/kB).
  - **Body views**: _Pretty_, _Raw_, _Preview_.

> Tip: If you accidentally use https:// on localhost without TLS, Postman will error. Use http://.

---

## 5) Middleware you need (very important)

Express does **not** parse request bodies by default.

- For **JSON** payloads:
  ```jsx
  app.use(express.json());
  ```
- For **HTML form** (`application/x-www-form-urlencoded`) payloads:
  ```jsx
  app.use(express.urlencoded({ extended: false }));
  ```

> If req.body is undefined in your handler, you likely forgot the correct middleware for the content type you’re sending.

---

## 6) Endpoint behaviors (clean, minimal contracts)

### A) `GET /users` (HTML demo)

- Returns a simple HTML list of user first names (to show hybrid server: HTML + API).

### B) `GET /api/users`

- Returns all users as JSON array.

### C) `GET /api/users/:id`

- Returns the user with that numeric `id`.
- If user not found → `404 Not Found` with `{error:"User not found"}`.

### D) `POST /api/users` (create)

- **Request body** (either JSON or URL-encoded form). Example JSON:
  ```json
  {
    "first_name": "Piyush",
    "last_name": "Garg",
    "email": "piyush.garg@example.com",
    "gender": "male",
    "job_title": "Software Engineer"
  }
  ```
- **Server actions**
  - Validate required fields (at least `first_name`, `last_name`, `email`).
  - Create a new record; **server generates `id`** (e.g., `maxId + 1` for demo).
  - Optionally persist to `mock-data.json` (demo only).
- **Response**
  - `201 Created` with the created user (including new `id`).

### E) `PATCH /api/users/:id` (partial update)

- **Use PATCH**, not PUT, for partial changes.
- Request body includes only fields you want to change, e.g.:
  ```json
  { "job_title": "Senior Software Engineer" }
  ```
- If user not found → `404`.
- On success → `200 OK` with updated user.

### F) `DELETE /api/users/:id`

- Removes the user if found.
- Responses:
  - `204 No Content` (no body), or
  - `200 OK` with a confirmation message.
  - `404` if not found.

---

## 7) Example Postman runs

### 7.1 List all users

- Method: `GET`
- URL: `http://localhost:8000/api/users`
- Expect: `200 OK`, body = JSON array.

### 7.2 Create a user (two ways)

**Option A – JSON body**

- Method: `POST`
- Headers: `Content-Type: application/json`
- Body (raw → JSON):
  ```json
  {
    "first_name": "Jin Do",
    "last_name": "Example",
    "email": "jindo@example.com",
    "gender": "female",
    "job_title": "Proprietor"
  }
  ```
- Expect: `201 Created` and JSON with an auto-generated `id`.

**Option B – Form body**

- Method: `POST`
- Body: `x-www-form-urlencoded`
  - `first_name=Jin`
  - `last_name=Do`
  - `email=jin.do@example.com`
  - `gender=female`
  - `job_title=Proprietor`
- Make sure server has `express.urlencoded({ extended: false })`.

### 7.3 Update a user

- Method: `PATCH`
- URL: `http://localhost:8000/api/users/1004`
- Body (raw → JSON):
  ```json
  { "job_title": "Staff Engineer" }
  ```
- Expect: `200 OK` with updated user.

### 7.4 Delete a user

- Method: `DELETE`
- URL: `http://localhost:8000/api/users/1004`
- Expect: `204 No Content` (or `200 OK` with message).

---

## 8) Status codes (quick guide)

- `200 OK` → success (GET, PATCH, sometimes DELETE).
- `201 Created` → resource created (POST).
- `204 No Content` → success with no body (DELETE).
- `400 Bad Request` → invalid inputs.
- `404 Not Found` → no resource with that `id`.

---

## 9) Practical tips & common pitfalls

- **HTTP vs HTTPS on localhost**: use `http://` unless you’ve set up TLS.
- **Body parsing**:
  - JSON → `express.json()`
  - Form → `express.urlencoded({ extended: false })`
  - Without the right middleware, `req.body` will be `undefined`.
- **ID handling**:
  - In demos, `id = max(existingIds) + 1`.
    In real apps, DBs generate ids (e.g., auto-increment, UUID).
- **File persistence** (demo only):
  - Writing every change to `mock-data.json` is fine for practice, but not for production (race conditions, performance).
- **Performance in Postman**:
  - Time is shown in **ms** (milliseconds), not “million seconds”.
  - Lower is better; measure and optimize in real environments.

---

## 10) Minimal handler patterns (for reference)

> Not full code—just the shapes you’ll use:

```jsx
// Create
app.post("/api/users", (req, res) => {
  const body = req.body; // requires express.json() or urlencoded()
  // validate, generate id, push to users[], optionally fs.writeFile
  return res.status(201).json(newUser);
});

// Update (partial)
app.patch("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  // find user, merge fields from req.body, save
  return res.json(updatedUser);
});

// Delete
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  // find index, splice
  return res.status(204).end();
});
```

---

## 11) Corrections & clarifications (from the transcript)

- **“12 million seconds”** mentioned while talking about request duration was a slip—Postman shows **milliseconds (ms)**, e.g., `12 ms`.
- The video alternates between saying **PUT** and **PATCH**.
  - Here we use **PATCH** for **partial updates** (recommended for this scenario).
- Use **HTTP** on localhost unless you configure SSL; **HTTPS** without a certificate will fail in Postman.

---

## 12) Tiny mental model (ASCII)

```
POST /api/users
   |
   +--> [Middleware parses body]
   |        - express.json()   <-- for application/json
   |        - urlencoded()     <-- for form bodies
   |
   +--> [Handler]
            - Validate input
            - Generate id
            - users.push(newUser)
            - (optional) fs.writeFile('mock-data.json', JSON.stringify(users))
            - res.status(201).json(newUser)

```

---

here’s a **single complete `index.js`** file that runs an Express server with a `/weather` endpoint calling the **OpenWeatherMap API**.

It includes all setup, environment variable loading, and CORS handling in one place.

```jsx
// index.js
require("dotenv").config(); // Load .env file variables

const express = require("express");
const fetch = require("node-fetch"); // For API calls
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Weather API backend is running" });
});

// Weather endpoint
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    res.json({
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind_speed: data.wind.speed,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Instructions to use:**

1. Run:

   ```bash
   npm init -y
   npm install express node-fetch cors dotenv

   ```

2. Create a `.env` file in the root:

   ```
   OPENWEATHER_API_KEY=your_api_key_here

   ```

3. Start the server:

   ```bash
   node index.js

   ```

4. Call:

   ```
   http://localhost:5000/weather?city=London

   ```
