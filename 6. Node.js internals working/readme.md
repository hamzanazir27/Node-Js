![image.png](attachment:cf1b7bab-019d-4595-b219-ec7fdf59a4fe:image.png)

# Code Execution Flow - Step by Step

## Code Analysis

```jsx
const fs = require("fs");

setTimeout(() => console.log("Hello from Timer 1"), 0);
setImmediate(() => console.log("Hello from Immediate Fn 1"));

fs.readFile("sample.txt", "utf-8", () => {
  console.log("IO Polling Fininsh");

  setTimeout(() => console.log("Hello from Timer 2"), 0);
  setTimeout(() => console.log("Hello from Timer 3"), 5 * 1000);
  setImmediate(() => console.log("Hello from Immediate Fn 2"));
});

console.log("Hello from Top Level Code");
```

## Execution Flow

### Phase 1: Synchronous Code Execution

```
Call Stack:
├── require('fs') - executes immediately
├── setTimeout(Timer 1) - registers timer, goes to Timer Queue
├── setImmediate(Immediate 1) - registers callback, goes to Check Queue
├── fs.readFile() - starts async I/O operation, goes to Thread Pool
└── console.log('Top Level Code') - executes immediately

Output: "Hello from Top Level Code"

```

### Phase 2: Event Loop Starts

```
Event Loop Phases:

1. Timer Phase:
   └── Timer 1 callback executes → "Hello from Timer 1"

2. I/O Phase:
   └── (file still reading in background)

3. Check Phase:
   └── Immediate 1 callback executes → "Hello from Immediate Fn 1"

4. I/O Operation Completes:
   ├── File read finishes in thread pool
   ├── I/O callback queued
   └── Next event loop iteration picks it up

```

### Phase 3: I/O Callback Execution

```
When fs.readFile completes:
├── console.log('IO Polling Fininsh') - executes immediately
├── setTimeout(Timer 2, 0ms) - registers timer
├── setTimeout(Timer 3, 5000ms) - registers timer
└── setImmediate(Immediate 2) - registers callback

Output: "IO Polling Fininsh"

```

### Phase 4: New Event Loop Cycles

```
Next Event Loop Iterations:

Timer Phase:
└── Timer 2 executes → "Hello from Timer 2"

Check Phase:
└── Immediate 2 executes → "Hello from Immediate Fn 2"

Timer Phase (after 5 seconds):
└── Timer 3 executes → "Hello from Timer 3"

```

## Final Output Order

```
1. Hello from Top Level Code       (Synchronous)
2. Hello from Timer 1             (Timer Phase - 0ms)
3. Hello from Immediate Fn 1      (Check Phase)
4. IO Polling Fininsh            (I/O Callback)
5. Hello from Immediate Fn 2      (Check Phase - from I/O callback)
6. Hello from Timer 2             (Timer Phase - 0ms from I/O callback)
7. Hello from Timer 3             (Timer Phase - 5000ms delay)

```

## Key Points

1. **Synchronous code** executes first on call stack
2. **Timer 1 vs Immediate 1**: Timer runs before setImmediate in initial loop
3. **I/O callback creates new async operations** that follow same event loop rules
4. **Inside I/O callback**: setImmediate runs before setTimeout(0)
5. **Timer 3** waits full 5 seconds before executing

---

# Complete Node.js Threading Demo: Code, Output & Behind-the-Scenes

## Experiment 1: Basic Thread Pool Behavior (4 Tasks = 4 Threads)

### Code:

```jsx
const crypto = require("crypto");

console.log("Starting 4 CPU-intensive tasks...");
const start = Date.now();

// Task 1
crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password1 done:", Date.now() - start, "ms");
});

// Task 2
crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password2 done:", Date.now() - start, "ms");
});

// Task 3
crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password3 done:", Date.now() - start, "ms");
});

// Task 4
crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password4 done:", Date.now() - start, "ms");
});

console.log("All tasks scheduled, main thread continues...");
```

### Output:

```
Starting 4 CPU-intensive tasks...
All tasks scheduled, main thread continues...
Password1 done: 598 ms
Password3 done: 601 ms
Password2 done: 603 ms
Password4 done: 605 ms

```

### Behind the Scenes:

```
Time: 0ms
┌─────────────────┐    ┌──────────────────┐
│   Main Thread   │    │   Thread Pool    │
│   (Event Loop)  │    │                  │
│                 │    │ Thread 1: [IDLE] │
│ - Schedule T1   │───▶│ Thread 2: [IDLE] │
│ - Schedule T2   │    │ Thread 3: [IDLE] │
│ - Schedule T3   │    │ Thread 4: [IDLE] │
│ - Schedule T4   │    │                  │
│ - Print "All    │    │                  │
│   tasks..."     │    │                  │
└─────────────────┘    └──────────────────┘

Time: 1ms (All tasks start simultaneously)
┌─────────────────┐    ┌──────────────────┐
│   Main Thread   │    │   Thread Pool    │
│   (Event Loop)  │    │                  │
│                 │    │ Thread 1: [T1] ● │
│ - Waiting for   │    │ Thread 2: [T2] ● │
│   callbacks     │    │ Thread 3: [T3] ● │
│                 │    │ Thread 4: [T4] ● │
└─────────────────┘    └──────────────────┘

Time: ~600ms (Tasks complete almost simultaneously)
┌─────────────────┐    ┌──────────────────┐
│   Main Thread   │    │   Thread Pool    │
│   (Event Loop)  │    │                  │
│ ◄──────────────────── T1 Complete       │
│ ◄──────────────────── T2 Complete       │
│ ◄──────────────────── T3 Complete       │
│ ◄──────────────────── T4 Complete       │
│                 │    │ Thread 1: [IDLE] │
│                 │    │ Thread 2: [IDLE] │
│                 │    │ Thread 3: [IDLE] │
│                 │    │ Thread 4: [IDLE] │
└─────────────────┘    └──────────────────┘

```

---

## Experiment 2: Thread Pool Exhaustion (5 Tasks > 4 Threads)

### Code:

```jsx
const crypto = require("crypto");

console.log("Starting 5 CPU-intensive tasks...");
const start = Date.now();

crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password1 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password2 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password3 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password4 done:", Date.now() - start, "ms");
});

// 5th task - will have to wait
crypto.pbkdf2("password5", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password5 done:", Date.now() - start, "ms");
});
```

### Output:

```
Starting 5 CPU-intensive tasks...
Password1 done: 597 ms
Password2 done: 598 ms
Password3 done: 603 ms
Password4 done: 605 ms
Password5 done: 1203 ms  ← Notice the delay!

```

### Behind the Scenes:

```
Time: 0ms (Initial scheduling)
┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐
│   Main Thread   │    │   Thread Pool    │    │    Queue    │
│                 │    │                  │    │             │
│ - Schedule T1   │───▶│ Thread 1: [T1] ● │    │             │
│ - Schedule T2   │───▶│ Thread 2: [T2] ● │    │             │
│ - Schedule T3   │───▶│ Thread 3: [T3] ● │    │             │
│ - Schedule T4   │───▶│ Thread 4: [T4] ● │    │             │
│ - Schedule T5   │────────────────────────────▶│    [T5]     │
│                 │    │                  │    │  (waiting)  │
└─────────────────┘    └──────────────────┘    └─────────────┘

Time: ~600ms (First batch completes)
┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐
│   Main Thread   │    │   Thread Pool    │    │    Queue    │
│                 │    │                  │    │             │
│ ◄──────────────────── T1 Complete       │    │             │
│ ◄──────────────────── T2 Complete       │    │             │
│ ◄──────────────────── T3 Complete       │    │             │
│ ◄──────────────────── T4 Complete       │    │             │
│                 │    │ Thread 1: [T5] ●─┼────┤  T5 starts  │
│                 │    │ Thread 2: [IDLE] │    │             │
│                 │    │ Thread 3: [IDLE] │    │             │
│                 │    │ Thread 4: [IDLE] │    │             │
└─────────────────┘    └──────────────────┘    └─────────────┘

Time: ~1200ms (T5 completes)
┌─────────────────┐    ┌──────────────────┐
│   Main Thread   │    │   Thread Pool    │
│                 │    │                  │
│ ◄──────────────────── T5 Complete       │
│                 │    │ Thread 1: [IDLE] │
│                 │    │ Thread 2: [IDLE] │
│                 │    │ Thread 3: [IDLE] │
│                 │    │ Thread 4: [IDLE] │
└─────────────────┘    └──────────────────┘

```

---

## Experiment 3: 6 Tasks - Queue Batching

### Code:

```jsx
const crypto = require("crypto");

console.log("Starting 6 CPU-intensive tasks...");
const start = Date.now();

// First batch (will use all 4 threads)
crypto.pbkdf2("password1", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password1 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password2", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password2 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password3", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password3 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password4", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password4 done:", Date.now() - start, "ms");
});

// Second batch (will wait and then run together)
crypto.pbkdf2("password5", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password5 done:", Date.now() - start, "ms");
});

crypto.pbkdf2("password6", "salt1", 100000, 1024, "sha512", (err, hash) => {
  console.log("Password6 done:", Date.now() - start, "ms");
});
```

### Output:

```
Starting 6 CPU-intensive tasks...
Password1 done: 595 ms
Password2 done: 598 ms
Password3 done: 601 ms
Password4 done: 603 ms
Password5 done: 1198 ms  ← Second batch
Password6 done: 1205 ms  ← Second batch

```

---

## Experiment 4: Custom Thread Pool Size

### Code:

```jsx
// Set custom thread pool size BEFORE requiring crypto
process.env.UV_THREADPOOL_SIZE = 10;

const crypto = require("crypto");

console.log("Thread pool size set to 10");
console.log("Starting 6 CPU-intensive tasks...");
const start = Date.now();

for (let i = 1; i <= 6; i++) {
  crypto.pbkdf2(
    `password${i}`,
    "salt1",
    100000,
    1024,
    "sha512",
    (err, hash) => {
      console.log(`Password${i} done:`, Date.now() - start, "ms");
    }
  );
}
```

### Output with Thread Pool Size = 10:

```
Thread pool size set to 10
Starting 6 CPU-intensive tasks...
Password1 done: 592 ms
Password2 done: 595 ms
Password3 done: 598 ms
Password4 done: 601 ms
Password5 done: 603 ms  ← Now runs with first batch!
Password6 done: 605 ms  ← Now runs with first batch!

```

### Output with Thread Pool Size = 2:

```jsx
process.env.UV_THREADPOOL_SIZE = 2;
```

```
Thread pool size set to 2
Starting 6 CPU-intensive tasks...
Password1 done: 598 ms   ← Batch 1 (2 threads)
Password2 done: 603 ms   ← Batch 1 (2 threads)
Password3 done: 1205 ms  ← Batch 2 (reused threads)
Password4 done: 1208 ms  ← Batch 2 (reused threads)
Password5 done: 1810 ms  ← Batch 3 (reused threads)
Password6 done: 1815 ms  ← Batch 3 (reused threads)

```

---

## Experiment 5: Thread Pool Size = 1 (Sequential Processing)

### Code:

```jsx
process.env.UV_THREADPOOL_SIZE = 1;

const crypto = require("crypto");

console.log("Thread pool size set to 1 - Sequential processing");
const start = Date.now();

for (let i = 1; i <= 4; i++) {
  crypto.pbkdf2(
    `password${i}`,
    "salt1",
    100000,
    1024,
    "sha512",
    (err, hash) => {
      console.log(`Password${i} done:`, Date.now() - start, "ms");
    }
  );
}
```

### Output:

```
Thread pool size set to 1 - Sequential processing
Password1 done: 595 ms   ← Uses the only thread
Password2 done: 1198 ms  ← Waits for thread
Password3 done: 1805 ms  ← Waits for thread
Password4 done: 2410 ms  ← Waits for thread

```

---

## Complete Architecture Explanation

### Node.js Event Loop + Thread Pool Model:

```
┌─────────────────────────────────────────────────────────┐
│                    NODE.JS PROCESS                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   MAIN THREAD   │    │       THREAD POOL           │ │
│  │  (Event Loop)   │    │     (libuv threads)         │ │
│  │                 │    │                             │ │
│  │ ┌─────────────┐ │    │  ┌─────┐ ┌─────┐ ┌─────┐    │ │
│  │ │   Stack     │ │    │  │ T1  │ │ T2  │ │ T3  │ ...│ │
│  │ │             │ │    │  └─────┘ └─────┘ └─────┘    │ │
│  │ └─────────────┘ │    │                             │ │
│  │ ┌─────────────┐ │    │  Default Size: 4            │ │
│  │ │  Call Queue │ │    │  Configurable via:          │ │
│  │ │             │ │    │  UV_THREADPOOL_SIZE         │ │
│  │ └─────────────┘ │    │                             │ │
│  │ ┌─────────────┐ │    └─────────────────────────────┘ │
│  │ │Event Queue  │ │                                    │
│  │ │             │ │                                    │
│  │ └─────────────┘ │                                    │
│  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────┘

```

### Step-by-Step Process Flow:

1. **Task Scheduling Phase (Synchronous)**:

   ```
   Main Thread: "I need to hash 4 passwords"
   Main Thread: "Let me schedule these to the thread pool"
   Main Thread: "Task 1 → Thread Pool Queue"
   Main Thread: "Task 2 → Thread Pool Queue"
   Main Thread: "Task 3 → Thread Pool Queue"
   Main Thread: "Task 4 → Thread Pool Queue"
   Main Thread: "All scheduled, continuing with next code..."

   ```

2. **Thread Pool Assignment**:

   ```
   Thread Pool Manager: "I have 4 available threads"
   Thread Pool Manager: "Assigning Task 1 to Thread 1"
   Thread Pool Manager: "Assigning Task 2 to Thread 2"
   Thread Pool Manager: "Assigning Task 3 to Thread 3"
   Thread Pool Manager: "Assigning Task 4 to Thread 4"

   ```

3. **Parallel Execution**:

   ```
   Thread 1: "Working on password1 hash..." [CPU INTENSIVE]
   Thread 2: "Working on password2 hash..." [CPU INTENSIVE]
   Thread 3: "Working on password3 hash..." [CPU INTENSIVE]
   Thread 4: "Working on password4 hash..." [CPU INTENSIVE]
   Main Thread: "I'm free to handle other events..."

   ```

4. **Completion and Callbacks**:

   ```
   Thread 1: "password1 hash complete! Sending callback to main thread"
   Thread 2: "password2 hash complete! Sending callback to main thread"
   Thread 3: "password3 hash complete! Sending callback to main thread"
   Thread 4: "password4 hash complete! Sending callback to main thread"

   Main Thread Event Loop: "Oh, I have 4 callbacks to execute!"
   Main Thread: "Executing callback 1 → Print 'Password1 done'"
   Main Thread: "Executing callback 2 → Print 'Password2 done'"
   Main Thread: "Executing callback 3 → Print 'Password3 done'"
   Main Thread: "Executing callback 4 → Print 'Password4 done'"

   ```

### What Operations Use Thread Pool:

1. **File System Operations**: `fs.readFile()`, `fs.writeFile()`
2. **Cryptography**: `crypto.pbkdf2()`, `crypto.randomBytes()`
3. **Compression**: `zlib.deflate()`, `zlib.inflate()`
4. **DNS Lookups**: `dns.lookup()`
5. **Some CPU-intensive operations**

### What Stays on Main Thread:

1. **Network I/O**: HTTP requests, TCP connections
2. **Timers**: `setTimeout()`, `setInterval()`
3. **Process operations**: `process.nextTick()`
4. **Simple callbacks and promises**

### Key Performance Insights:

1. **Thread Pool Exhaustion**: When tasks > threads, queuing occurs
2. **Optimal Thread Pool Size**: Usually CPU cores \* 2, but test your specific workload
3. **Memory vs Performance**: More threads = more memory usage
4. **I/O vs CPU bound**: Network operations don't use thread pool, CPU operations do

This architecture makes Node.js incredibly efficient for I/O-heavy applications while still handling CPU-intensive tasks effectively through the thread pool mechanism.

# Node.js vs Multi-threaded Languages & Promise Execution - Complete Guide

## Architecture Comparison: Node.js vs PHP (Multi-threaded)

### Node.js Architecture (Hybrid Approach)

```
┌─────────────────────────────────────────────────────────────┐
│                      NODE.JS SERVER                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Multiple Users Request → Single Event Loop (Main Thread)  │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              EVENT LOOP (Main Thread)               │   │
│  │                                                     │   │
│  │  • Handles ALL incoming requests                    │   │
│  │  • Non-blocking I/O operations                      │   │
│  │  • Fast request processing                          │   │
│  │  • Single-threaded by default                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                 │
│                           ▼ (Only for CPU-intensive tasks) │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                THREAD POOL                          │   │
│  │                                                     │   │
│  │  • Used for CPU-intensive operations               │   │
│  │  • File system operations                          │   │
│  │  • Cryptography (password hashing)                 │   │
│  │  • Compression/Decompression                       │   │
│  │  • Custom size (default: 4)                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

```

### PHP Architecture (Traditional Multi-threaded)

```
┌─────────────────────────────────────────────────────────────┐
│                        PHP SERVER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Multiple Users Request → Multiple Threads (One per request)│
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │Thread 1 │  │Thread 2 │  │Thread 3 │  │Thread 4 │  ...  │
│  │         │  │         │  │         │  │         │       │
│  │ User A  │  │ User B  │  │ User C  │  │ User D  │       │
│  │ Request │  │ Request │  │ Request │  │ Request │       │
│  │         │  │         │  │         │  │         │       │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
│                                                             │
│  • Each request = One dedicated thread                     │
│  • No event loop concept                                   │
│  • Resource intensive (memory per thread)                  │
│  • Thread blocking can affect performance                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

```

## Detailed Comparison

### Node.js Approach:

```jsx
// All these requests handled by single event loop
app.get("/api/users", (req, res) => {
  // Fast, non-blocking operation
  res.json({ users: getUserList() });
});

app.get("/api/profile", (req, res) => {
  // Another fast operation on same thread
  res.json({ profile: getProfile(req.user.id) });
});

app.post("/api/hash-password", (req, res) => {
  // CPU-intensive: Offloaded to thread pool
  crypto.pbkdf2(
    req.body.password,
    "salt",
    100000,
    64,
    "sha512",
    (err, hash) => {
      res.json({ hash: hash.toString("hex") });
    }
  );
});
```

**Node.js Request Flow:**

```
Request 1 (Simple API) → Event Loop → Immediate Response
Request 2 (Simple API) → Event Loop → Immediate Response
Request 3 (CPU Task)   → Event Loop → Thread Pool → Callback → Response
Request 4 (Simple API) → Event Loop → Immediate Response (not blocked!)

```

### PHP Approach:

```php
<?php
// Each request gets its own thread/process

// Request 1: Gets Thread 1
function getUsersAPI() {
    return json_encode(['users' => getUserList()]);
}

// Request 2: Gets Thread 2
function getProfileAPI() {
    return json_encode(['profile' => getProfile($_SESSION['user_id'])]);
}

// Request 3: Gets Thread 3 (blocks this thread entirely)
function hashPasswordAPI() {
    $hash = password_hash($_POST['password'], PASSWORD_BCRYPT, ['cost' => 12]);
    return json_encode(['hash' => $hash]);
}
?>

```

**PHP Request Flow:**

```
Request 1 → Thread 1 → Processing → Response
Request 2 → Thread 2 → Processing → Response
Request 3 → Thread 3 → Processing (blocks thread) → Response
Request 4 → Thread 4 → Processing → Response

If all threads busy → Request 5 → WAIT for available thread

```

## Performance Implications

### Scenario 1: High Traffic, Simple API Calls

**Node.js:**

```
1000 concurrent users → 1 Event Loop handles all
✅ Very efficient memory usage
✅ Fast response times
✅ Non-blocking operations

```

**PHP:**

```
1000 concurrent users → 1000 threads needed
❌ High memory usage (each thread ~8MB)
❌ Context switching overhead
❌ Resource limitations

```

### Scenario 2: CPU-Intensive Operations

**Node.js:**

```
10 password hashing requests → Thread Pool (4 threads by default)
• First 4: Parallel processing
• Next 6: Queue and wait
• Event loop remains free for other requests

```

**PHP:**

```
10 password hashing requests → 10 dedicated threads
• All process in parallel (if threads available)
• Each thread blocked during processing
• High resource usage

```

## When to Use Each Approach

### Node.js is Best For:

```
✅ REST APIs
✅ Real-time applications (chat, gaming)
✅ I/O-intensive applications
✅ Microservices architecture
✅ JSON APIs
✅ WebSocket connections
✅ Streaming applications

```

### Multi-threaded Languages (PHP, Java, C#) Better For:

```
✅ CPU-intensive applications
✅ Heavy computational tasks
✅ Image/video processing
✅ Scientific computing
✅ Traditional web applications with server-side rendering
✅ Applications requiring true parallel processing

```

## Hybrid Architecture Approach

### Modern Backend Strategy:

```
┌─────────────────────────────────────────────────────────────┐
│                 MICROSERVICES ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   Node.js APIs  │    │    CPU-Intensive Services       │ │
│  │                 │    │                                 │ │
│  │ • User Management│    │ • Image Processing (Python)    │ │
│  │ • Authentication│    │ • Video Encoding (Go)          │ │
│  │ • Real-time Chat│    │ • ML Models (Python)           │ │
│  │ • WebSocket APIs│    │ • Data Analytics (Java)        │ │
│  │ • JSON APIs     │    │ • Report Generation (C#)       │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

```

### Implementation Example:

```jsx
// Node.js API Server
app.post("/api/process-image", async (req, res) => {
  // Delegate CPU-intensive task to specialized service
  const result = await axios.post("http://python-service:5000/process", {
    image: req.body.imageData,
  });

  res.json(result.data);
});

// Fast JSON APIs handled by Node.js
app.get("/api/users", (req, res) => {
  res.json({ users: database.getUsers() });
});
```

## Promise Execution in Event Loop

### Promise Execution Timing

**Key Concept**: Promises execute during **phase transitions** in the event loop.

```
┌───────────────────────────┐
┌─>│           Poll            │  ← Connection callbacks,
│  │  (fetch, http requests)   │    data, etc.
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │      Promise Callbacks    │  ← Promises execute HERE
│  │    (between phases)       │    during transitions
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │          Check            │  ← setImmediate() callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
│  │      Promise Callbacks    │  ← Promises execute HERE
│  │    (between phases)       │    during transitions
│  └─────────────┬─────────────┘
│  ┌─────────────▼─────────────┐
└──┤      Close Callbacks      │  ← Close event callbacks
   └───────────────────────────┘

```

### Promise Execution Example:

```jsx
console.log("1: Start");

setTimeout(() => console.log("2: Timeout"), 0);

Promise.resolve().then(() => console.log("3: Promise 1"));
Promise.resolve().then(() => console.log("4: Promise 2"));

setImmediate(() => console.log("5: Immediate"));

Promise.resolve().then(() => console.log("6: Promise 3"));

console.log("7: End");
```

**Output:**

```
1: Start
7: End
3: Promise 1
4: Promise 2
6: Promise 3
2: Timeout
5: Immediate

```

**Execution Flow:**

1. Synchronous code executes first (1, 7)
2. Event loop transitions → Promise callbacks execute (3, 4, 6)
3. Timer phase → setTimeout executes (2)
4. Check phase → setImmediate executes (5)

### Advanced Promise Timing:

```jsx
const fs = require("fs");

console.log("Start");

// File I/O - will use thread pool
fs.readFile(__filename, () => {
  console.log("File read complete");

  Promise.resolve().then(() => console.log("Promise after file read"));

  setImmediate(() => console.log("Immediate after file read"));
});

Promise.resolve().then(() => console.log("Initial promise"));

setTimeout(() => console.log("Timer"), 0);

console.log("End");
```

**Output:**

```
Start
End
Initial promise
Timer
File read complete
Promise after file read
Immediate after file read

```

## Summary

### Node.js Advantages:

- **Efficient for I/O-heavy applications**
- **Low memory footprint**
- **Fast for JSON APIs**
- **Great for real-time applications**
- **Single-threaded simplicity**

### Node.js Limitations:

- **CPU-intensive tasks can block**
- **Limited by thread pool for heavy computations**
- **Not ideal for pure computational work**

### Best Practice:

**Use Node.js for APIs and I/O operations, delegate CPU-intensive tasks to specialized services in other languages.**

This hybrid approach gives you the best of both worlds - Node.js efficiency for web APIs combined with the computational power of multi-threaded languages for heavy processing.
