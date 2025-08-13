## **First Program & Package.json Basics**

### **1. What is Node.js?**

- Node.js is a **JavaScript runtime environment** (outside the browser).
- Built using **V8 engine** + **C++** for additional server-side capabilities.
- **Browser JS** has `window` & `document` objects;
  **Node.js** removes them because they are not needed on the server.
- Node.js adds extra server-side features like:
  - File handling
  - Cryptography
  - Network operations

---

### **2. Writing First Program**

1. Create an empty folder (e.g., `NodeJS`).
2. Inside it, create another folder for your program (e.g., `HelloWorld`).
3. Open in your favorite code editor.
4. Create a file `hello.js`.
5. Write:

   ```jsx
   console.log("Hey there!");
   ```

6. Run in terminal:

   ```
   node hello.js

   ```

---

### **3. Why `window` is not available**

- In browser:
  - `window`, `alert`, `document` work because browser provides them.
- In Node.js:
  - These objects are **removed** since they are browser-specific.
  - Only **core server-side functions** are kept.

---

### **4. NPM (Node Package Manager)**

- Comes with Node.js.
- Manages **packages** and **dependencies**.
- Command:
  ```
  npm -v   // check version

  ```

---

### **5. Creating `package.json`**

- Run:
  ```
  npm init

  ```
- It asks details:
  - Project name
  - Version
  - Description
  - Entry point file (default = `hello.js`)
- Creates **`package.json`** file (configuration for your project).

---

### **6. Purpose of `package.json`**

- Stores:
  - Project name, version, author
  - Scripts (custom commands)
  - Dependencies
- Used when:
  - Installing packages
  - Running scripts
  - Publishing project

---

### **7. Adding Scripts**

- In `package.json`:
  ```json
  "scripts": {
    "start": "node hello.js"
  }

  ```
- Run:
  ```
  npm start

  ```
- Useful for running multiple setup commands before starting the app.

---

**→ Key Takeaways**

- Node.js runs JS outside browsers.
- No `window` or DOM functions.
- Use `npm init` to create `package.json`.
- `package.json` is the project’s configuration.
- Use scripts to automate running your app.

---
