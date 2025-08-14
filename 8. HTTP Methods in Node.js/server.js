const http = require("http");

const server = http.createServer((req, res) => {
  // CORS aur JSON handle karne ke liye
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    ////////////////////////////////////////////////// get

    // Example: /home
    res.end(JSON.stringify({ message: "GET request - Data fetch kiya" }));

    /////////////////////////////////////////get
  } else if (req.method === "POST") {
    ///post///////////////////////////////////////

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.end(
        JSON.stringify({ message: "POST request - Data receive hua", data })
      );
    });

    ///post////////////////////////////////////////////////////////////
  } else if (req.method === "PUT") {
    ///put//////

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.end(
        JSON.stringify({ message: "PUT request - Pura data replace hua", data })
      );
    });

    ///put//////
  } else if (req.method === "PATCH") {
    ///patch//////

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const data = JSON.parse(body);
      res.end(
        JSON.stringify({
          message: "PATCH request - Partially update hua",
          data,
        })
      );

      ///patch//////
    });
  } else if (req.method === "DELETE") {
    /////delete

    res.end(JSON.stringify({ message: "DELETE request - Data delete hua" }));

    /////delete
  } else {
    res.statusCode = 405;
    res.end(JSON.stringify({ message: "Method not allowed" }));
  }
});

// Server start
server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
