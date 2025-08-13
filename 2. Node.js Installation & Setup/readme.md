## **Node.js Installation & Setup **

### 1. **What is Node.js?**

- JavaScript runtime to run JS outside the browser.
- Lets you build backend apps, servers, and tools.

---

### 2. **Download Node.js**

- Go to [**nodejs.org**](https://nodejs.org/) (official website).
- You’ll see **two buttons**:
  1. **LTS (Long Term Support)** → Stable, recommended for most users, safe for production.
  2. **Current** → Latest features, may be unstable, for testing only.

**Rule:** Always download **LTS version** for stability.

- Even-numbered versions = LTS (stable).
- Odd-numbered versions = Current (unstable).

---

### 3. **Install Node.js**

- Open the downloaded setup file.
- Click **Next → Accept → Install**.
- Done! Node.js is now installed.

---

### 4. **Verify Installation**

Open **Command Prompt / Terminal** and run:

- `node -v` → Shows Node.js version.
- `npm -v` → Shows NPM version.

If both show numbers, installation is successful.

---

### 5. **What is NPM?**

- **Node Package Manager**.
- Comes with Node.js by default.
- Lets you install, update, and remove packages (libraries).

Example:

```bash
npm install package-name
npm uninstall package-name

```

---

### 6. **Using Node REPL**

- Type `node` in terminal → Opens REPL (interactive JS console).
- `.exit` → To quit REPL.
- In REPL, you can directly run JS code like:

```jsx
console.log(2 + 3);
```

---

✅ **Always use LTS for production work**

✅ **Check version before starting projects**

✅ **Use npm for package management**

---
