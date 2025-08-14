// Import File System module
const fs = require("fs");

console.log("=== Node.js File Handling Examples ===");

// 1. WRITE FILE
// Synchronous
// fs.writeFileSync("./test.txt", "Hello World - Synchronous Write");
// console.log("File written synchronously.");

// // Asynchronous
// fs.writeFile("./test_async.txt", "Hello World - Asynchronous Write", (err) => {
//   if (err) console.error(err);
//   else console.log("File written asynchronously.");
// });

// // 2. READ FILE
// // Synchronous
// const syncData = fs.readFileSync("./test.txt", "utf-8");
// console.log("Read synchronously:", syncData);

// // Asynchronous
// fs.readFile("./test_async.txt", "utf-8", (err, data) => {
//   if (err) console.error(err);
//   else console.log("Read asynchronously:", data);
// });

// 3. APPEND TO FILE
// // Synchronous
// fs.appendFileSync("./test.txt", "\nAppended Line (Sync)");
// console.log("Appended synchronously.");

// // Asynchronous
// fs.appendFile("./test_async.txt", "\nAppended Line (Async)", (err) => {
//   if (err) console.error(err);
//   else console.log("Appended asynchronously.");
// });

// // 4. COPY FILE
// // Synchronous
// fs.copyFileSync("./test.txt", "./copy.txt");
// console.log("File copied synchronously.");

// // Asynchronous
// fs.copyFile("./test_async.txt", "./copy_async.txt", (err) => {
//   if (err) console.error(err);
//   else console.log("File copied asynchronously.");
// });

// // 5. DELETE FILE
// // Synchronous
// fs.unlinkSync("./copy.txt");
// console.log("File deleted synchronously.");

// // Asynchronous
// fs.unlink("./copy_async.txt", (err) => {
//   if (err) console.error(err);
//   else console.log("File deleted asynchronously.");
// });

// // 6. FILE STATUS (Stats)
// const stats = fs.statSync("./test.txt");
// console.log("Is file?", stats.isFile());
// console.log("Is directory?", stats.isDirectory());
// console.log("File size (bytes):", stats.size);

// 7. CREATE DIRECTORIES
// // Synchronous
// fs.mkdirSync("./myDocs/folderA/folderB", { recursive: true });
// console.log("Directories created synchronously.");

// // // Asynchronous
// fs.mkdir("./myDocs_async/folderX/folderY", { recursive: true }, (err) => {
//   if (err) console.error(err);
//   else console.log("Directories created asynchronously.");
// });
