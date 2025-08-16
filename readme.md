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
