## **1. Introduction to File Handling in Node.js**

- **Purpose**: Perform operations like create, read, write, append, copy, delete files, and create/delete directories.
- **Module Used**:
  - `fs` (File System module)
  - Built-in, no need for `./` path when importing:
    ```jsx
    const fs = require("fs");
    ```

---

## **2. Writing to Files**

### **Synchronous**

- **Function**: `fs.writeFileSync(path, data)`
- **Behavior**:
  - Blocks execution until the file is written.
  - Overwrites file content if it exists.
- **Example**:
  ```jsx
  fs.writeFileSync("./test.txt", "Hello World");
  ```

### **Asynchronous**

- **Function**: `fs.writeFile(path, data, callback)`
- **Behavior**:
  - Non-blocking; requires a callback to handle errors.
- **Example**:
  ```jsx
  fs.writeFile("./test.txt", "Hello World", (err) => {
    if (err) console.error(err);
  });
  ```

---

## **3. Reading Files**

### **Synchronous**

- **Function**: `fs.readFileSync(path, encoding)`
- **Behavior**:
  - Returns the content directly.
- **Example**:
  ```jsx
  const data = fs.readFileSync("./contacts.txt", "utf-8");
  console.log(data);
  ```

### **Asynchronous**

- **Function**: `fs.readFile(path, encoding, callback)`
- **Behavior**:
  - Uses callback with `(error, data)` parameters.
- **Example**:
  ```jsx
  fs.readFile("./contacts.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    else console.log(data);
  });
  ```

---

## **4. Difference: Synchronous vs Asynchronous**

- **Synchronous**:
  - Blocks execution.
  - Returns data directly.
- **Asynchronous**:
  - Non-blocking.
  - Requires callback.
- **Key Concepts**: Blocking vs Non-blocking, Event Loop.

---

## **5. Appending to Files**

- **Function**: `fs.appendFile(path, data, callback)` or `fs.appendFileSync(path, data)`
- **Usage**:
  ```jsx
  fs.appendFileSync("./test.txt", "\nNew Entry");
  ```
- **Benefit**: Useful for logging requests, storing activity history without overwriting data.

---

## **6. Copying Files**

- **Function**: `fs.copyFileSync(src, dest)`
- **Example**:
  ```jsx
  fs.copyFileSync("./test.txt", "./copy.txt");
  ```

---

## **7. Deleting Files**

- **Function**: `fs.unlinkSync(path)`
- **Example**:
  ```jsx
  fs.unlinkSync("./copy.txt");
  ```

---

## **8. File Status (Metadata)**

- **Function**: `fs.statSync(path)`
- **Info Provided**:
  - File size
  - Creation/modification date
  - File type (isFile / isDirectory)
- **Example**:
  ```jsx
  const stats = fs.statSync("./test.txt");
  console.log(stats.isFile()); // true
  ```

---

## **9. Creating Directories**

- **Function**: `fs.mkdirSync(path, { recursive: true })`
- **Example**:
  ```jsx
  fs.mkdirSync("./myDocs/folderA/folderB", { recursive: true });
  ```

---

## **10. Summary of `fs` Capabilities**

- **Create, Read, Write, Append, Copy, Delete files**
- **Check file stats**
- **Create and delete directories**
- **Both Synchronous & Asynchronous versions available**

---

here’s a **full Node.js script** showing **all file operations** (`fs` module) in **both synchronous and asynchronous** ways.

---

```jsx
// Import File System module
const fs = require("fs");

console.log("=== Node.js File Handling Examples ===");

// 1. WRITE FILE
// Synchronous
fs.writeFileSync("./test.txt", "Hello World - Synchronous Write");
console.log("File written synchronously.");

// Asynchronous
fs.writeFile("./test_async.txt", "Hello World - Asynchronous Write", (err) => {
  if (err) console.error(err);
  else console.log("File written asynchronously.");
});

// 2. READ FILE
// Synchronous
const syncData = fs.readFileSync("./test.txt", "utf-8");
console.log("Read synchronously:", syncData);

// Asynchronous
fs.readFile("./test_async.txt", "utf-8", (err, data) => {
  if (err) console.error(err);
  else console.log("Read asynchronously:", data);
});

// 3. APPEND TO FILE
// Synchronous
fs.appendFileSync("./test.txt", "\nAppended Line (Sync)");
console.log("Appended synchronously.");

// Asynchronous
fs.appendFile("./test_async.txt", "\nAppended Line (Async)", (err) => {
  if (err) console.error(err);
  else console.log("Appended asynchronously.");
});

// 4. COPY FILE
// Synchronous
fs.copyFileSync("./test.txt", "./copy.txt");
console.log("File copied synchronously.");

// Asynchronous
fs.copyFile("./test_async.txt", "./copy_async.txt", (err) => {
  if (err) console.error(err);
  else console.log("File copied asynchronously.");
});

// 5. DELETE FILE
// Synchronous
fs.unlinkSync("./copy.txt");
console.log("File deleted synchronously.");

// Asynchronous
fs.unlink("./copy_async.txt", (err) => {
  if (err) console.error(err);
  else console.log("File deleted asynchronously.");
});

// 6. FILE STATUS (Stats)
const stats = fs.statSync("./test.txt");
console.log("Is file?", stats.isFile());
console.log("Is directory?", stats.isDirectory());
console.log("File size (bytes):", stats.size);

// 7. CREATE DIRECTORIES
// Synchronous
fs.mkdirSync("./myDocs/folderA/folderB", { recursive: true });
console.log("Directories created synchronously.");

// Asynchronous
fs.mkdir("./myDocs_async/folderX/folderY", { recursive: true }, (err) => {
  if (err) console.error(err);
  else console.log("Directories created asynchronously.");
});
```

---

### **How to Run**

1. Save this as `fs_examples.js`
2. Run in terminal:

   ```bash
   node fs_examples.js

   ```

3. Watch files and folders get created, read, modified, and deleted.

---
