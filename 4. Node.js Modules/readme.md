## **Node.js Modules – Notes**

### **1. What Are Modules?**

- **Definition:** A module is a file containing reusable code that can be imported into other files.
- **Modular Programming:**
  - Breaking code into small, manageable pieces (modules).
  - Each module handles a specific functionality.
  - Makes code organized, maintainable, and reusable.
- **Example:**
  - `hello.js` (main file)
  - `maths.js` (contains math functions like add, subtract)

---

### **2. Creating a Custom Module**

1. Create a separate `.js` file (e.g., `maths.js`).
2. Write your functions inside it:

   ```jsx
   function add(a, b) {
     return a + b;
   }
   ```

3. **Export** the function so it can be used in other files.

---

### **3. Exporting from a Module**

### **Single Export (Default-like)**

- Export one value/function:
  ```jsx
  module.exports = add;
  ```
- In the importing file:
  ```jsx
  const add = require("./maths");
  console.log(add(2, 4)); // 6
  ```

### **Multiple Exports**

- Export multiple functions as an object:
  ```jsx
  function add(a, b) {
    return a + b;
  }
  function subtract(a, b) {
    return a - b;
  }

  module.exports = { add, subtract };
  ```
- Import and use:
  ```jsx
  const math = require("./maths");
  console.log(math.add(2, 4)); // 6
  console.log(math.subtract(2, 4)); // -2
  ```

### **Using `exports` Shortcut**

- Alternative to `module.exports`:
  ```jsx
  exports.add = (a, b) => a + b;
  exports.subtract = (a, b) => a - b;
  ```
- Both work, but:
  - `module.exports` replaces the whole export object.
  - `exports` adds properties to the export object.

---

### **4. Importing Modules**

- Use **`require()`**:
  - Syntax: `const varName = require('modulePath');`
  - Example for current directory:
    ```jsx
    const math = require("./maths");
    ```
  - `./` → Current directory
  - Without `./` → Searches in:
    - Built-in Node.js modules
    - Installed `node_modules` packages

---

### **5. Built-in Modules in Node.js**

- Node.js provides many modules by default:
  - **`http`** → Create web servers
  - **`fs`** → File system operations
  - **`crypto`** → Encryption and hashing
- Import example:
  ```jsx
  const http = require("http"); // Built-in, no './'
  ```

---

### **6. Key Points to Remember**

- **`require()`** is Node.js specific (not in browser JavaScript).
- Always **export** functions/variables if they need to be used elsewhere.
- `module.exports` can be assigned once (replaces export object).
- `exports` can add multiple properties.
- For multiple functions, prefer exporting an object.

---

### **7. Example Structure**

```
project/
│
├── hello.js
├── maths.js

```

**maths.js**

```jsx
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
module.exports = { add, subtract };
```

**hello.js**

```jsx
const { add, subtract } = require("./maths");
console.log(add(2, 4)); // 6
console.log(subtract(2, 4)); // -2
```

---
