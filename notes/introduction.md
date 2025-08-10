# Introduction to Node.js

## 1. What is Node.js?

- **Node.js is NOT a framework or library**.
- It is a **runtime environment** for executing JavaScript outside the browser.
- Allows JavaScript to run directly on a machine (server-side), not just in a web browser.

---

## 2. Why was Node.js needed?

- JavaScript originally ran only **inside browsers**.
- Browsers have **JavaScript engines** (e.g., Chrome → V8, Firefox → SpiderMonkey, Safari → JavaScriptCore).
- Without a browser, JavaScript couldn’t run.

---

## 3. How Node.js works

- **V8 Engine** (from Chrome) was extracted and combined with **C++**.
- C++ gives low-level access to machine features (like file handling, OS access).
- This combination allows JavaScript to:
  - Run outside the browser.
  - Interact with files, databases, and networks.

---

## 4. Key Benefits

- JavaScript can now run **server-side**.
- Same language for frontend & backend development.
- Can create **web servers**, **REST APIs**, **real-time apps**, etc.

---

## 5. Example

- In the browser console:
  ```javascript
  console.log("Hello from JavaScript");
  ```

Runs because the browser has a JavaScript engine.

- On your machine (terminal):

  - Run `node` command to enter Node REPL.
  - Type:

    ```javascript
    console.log("Hello from Node.js");
    ```

  - It works without a browser because Node.js includes the V8 engine.

---

## 6. Official Website

- [https://nodejs.org](https://nodejs.org) — Open-source, cross-platform runtime for JavaScript.

---

**Summary:**
Node.js is a **runtime environment** that lets you run JavaScript **outside the browser**, built on Chrome’s V8 engine and C++. It enables server-side programming and gives JavaScript the power to interact directly with the operating system.

```

---

```
