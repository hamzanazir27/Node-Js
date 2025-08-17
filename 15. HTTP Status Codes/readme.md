# HTTP Status Codes

---

## 1 — Quick summary

- **Status code** = short numeric code returned with every HTTP response.
- It tells the client whether the request succeeded, failed, or needs extra action.
- Codes are grouped by their first digit (1xx → 5xx). Each group has a general meaning.

---

## 2 — Status code groups (what each group means)

- **1xx — Informational**
  - Rarely used by APIs. Indicates provisional responses (e.g., `100 Continue`).
- **2xx — Success**
  - Request succeeded. Examples: `200 OK`, `201 Created`, `204 No Content`.
- **3xx — Redirection**
  - Client must take extra action (redirect). Examples: `301`, `302`, `304`.
- **4xx — Client error**
  - Client sent a bad request (input, auth, not found). Examples: `400`, `401`, `403`, `404`.
- **5xx — Server error**
  - Server failed while handling a valid request. Examples: `500`, `501`, `503`.

---

## 3 — Most useful codes and when to use them

### Success (2xx)

- **200 OK**
  - Use for successful GET requests and normal responses returning a body.
  - Example: `GET /api/users` → return users with `200`.
- **201 Created**
  - Use after successfully creating a new resource (POST).
  - Return the new resource or its location header (`Location: /api/users/123`).
  - Example: `POST /api/users` → `201` + created user.
- **202 Accepted**
  - Request accepted for processing but not completed (async jobs).
- **204 No Content**
  - Use when the action succeeded but you return no body (common for DELETE).
  - Example: `DELETE /api/users/123` → `204` (no JSON body).

### Client errors (4xx)

- **400 Bad Request**
  - Request malformed or missing required fields (validation error).
  - Example: missing `email` in POST create → `400`.
- **401 Unauthorized**
  - Authentication required or token invalid. The user is not authenticated.
- **403 Forbidden**
  - Authenticated but not allowed to perform this action (no permission).
- **404 Not Found**
  - Resource (route or item) does not exist.
  - Example: GET `/api/users/999` when user does not exist → `404`.
- **405 Method Not Allowed**
  - HTTP method not allowed for the route (e.g., POST on a read-only endpoint).
- **409 Conflict**
  - Resource conflict (duplicate key, version conflict).

> Note: 402 Payment Required exists but is rarely used; most APIs ignore it.

### Server errors (5xx)

- **500 Internal Server Error**
  - Generic server error (unhandled exception, bug).
- **501 Not Implemented**
  - Server does not support requested method/feature.
- **503 Service Unavailable**
  - Server temporarily unavailable (maintenance, overload).

---

## 4 — CRUD mapping (common REST practice)

- `GET /items` → **200 OK** (list)
- `GET /items/:id` → **200 OK** (item) or **404 Not Found**
- `POST /items` → **201 Created** (new item) or **400 Bad Request**
- `PUT /items/:id` / `PATCH /items/:id` → **200 OK** or **204 No Content** or **400/404**
- `DELETE /items/:id` → **204 No Content** or **404 Not Found**

---

## 5 — Express examples (practical code)

### Basic GET (200)

```jsx
app.get("/api/users", (req, res) => {
  res.status(200).json(users);
});
```

### Create (POST → 201)

```jsx
app.post("/api/users", (req, res) => {
  const { firstName, lastName, email } = req.body;
  // validation and creation...
  const newUser = { id: nextId(), firstName, lastName, email };
  users.push(newUser);
  res.status(201).json(newUser); // 201 Created
  // or: res.location(`/api/users/${newUser.id}`).status(201).json(newUser);
});
```

### Validate body → return 400 if missing required fields

```jsx
app.post("/api/users", (req, res) => {
  const { firstName, lastName, email } = req.body || {};
  if (!firstName || !lastName || !email) {
    return res
      .status(400)
      .json({ error: "firstName, lastName, email are required" });
  }
  // create...
});
```

### Not found (404)

```jsx
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user); // 200 by default
});
```

### Server error (500) — catch runtime errors

```jsx
app.get("/api/maybe-error", (req, res) => {
  try {
    // code that may throw
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
```

---

## 6 — Nodemon — avoid manual restarts

- Install dev dependency and add script:

```bash
npm i -D nodemon

```

package.json:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}

```

Run with:

```bash
npm run dev

```

Nodemon watches files and restarts server automatically on file changes.

---

## 7 — Testing tips (Postman / browser)

- Use **Postman** to test POST/PUT/PATCH/DELETE (browser address bar only does GET).
- Inspect returned **status code** and **response body**.
- For validation errors: expect `400` with an error message.
- For create: expect `201` and optionally `Location` header.

---

## 8 — Error handling & consistency (best practices)

- **Be consistent**: same structure for error responses, e.g. `{ error: 'message', details: {...} }`.
- Use correct standard codes (201 for create, 204 for successful no body).
- Do not send body with `204` (No Content).
- Use `401` for missing/invalid auth, `403` for forbidden actions, `404` for missing resources.
- For asynchronous processing, use `202 Accepted` and provide a way to check job status.
- Log server errors; return generic messages to avoid leaking internals.
- Use `res.status(code).json(...)` (or `res.sendStatus(code)` for simple cases).

---

## 9 — Small checklist for each endpoint

- [ ] Validate required fields → return **400** if invalid.
- [ ] If resource created → return **201** with created item or Location header.
- [ ] If resource updated → return **200**/`204`.
- [ ] If resource deleted → return **204**.
- [ ] If resource not found → return **404**.
- [ ] If auth missing → return **401**; if no permission → **403**.
- [ ] Catch exceptions and log, then return **500**.

---

## 10 — Common mistakes to avoid

- Returning `200` for a created resource instead of `201`.
- Returning body with `204` responses.
- Forgetting to validate input (leading to later 500 errors).
- Not using `next(err)` in async/express error handlers — errors may be unhandled.
- Leaking stack traces or internals in error responses.

---

## 11 — ASCII visuals

### A — Status code ranges

```
1xx  Informational   (rare)    e.g. 100 Continue
2xx  Success                  200 OK, 201 Created, 204 No Content
3xx  Redirection              301, 302, 304
4xx  Client error             400 Bad Request, 401, 403, 404
5xx  Server error             500 Internal Server Error, 503

```

### B — Simple request/response flow with status decisions

```
Client ---> Server (route handler)
               |
        Validate request?
           /       \
          No       Yes
         400       Proceed
                    |
            Resource exists?
              /        \
            No          Yes
           404         Do action
                         |
                   Action OK?
                   /      \
                 No       Yes
               500/4xx   200/201/204

```

### C — CRUD + expected code (compact)

```
GET /items           -> 200 OK (list) or 404
GET /items/:id       -> 200 OK or 404 Not Found
POST /items          -> 201 Created or 400 Bad Request
PUT/PATCH /items/:id -> 200 OK / 204 No Content or 400/404
DELETE /items/:id    -> 204 No Content or 404 Not Found

```

---

## 12 — Quick reference table (short)

| Code | Meaning               | When to send (example)        |
| ---- | --------------------- | ----------------------------- |
| 200  | OK                    | GET success                   |
| 201  | Created               | POST created resource         |
| 202  | Accepted              | Async job accepted            |
| 204  | No Content            | DELETE success (no body)      |
| 400  | Bad Request           | Validation failed             |
| 401  | Unauthorized          | Missing/invalid auth          |
| 403  | Forbidden             | Auth ok but no permission     |
| 404  | Not Found             | Route or item missing         |
| 405  | Method Not Allowed    | HTTP method not allowed       |
| 409  | Conflict              | Duplicate or version conflict |
| 500  | Internal Server Error | Server bug/exception          |
| 501  | Not Implemented       | Feature not implemented       |
| 503  | Service Unavailable   | Maintenance / overloaded      |
