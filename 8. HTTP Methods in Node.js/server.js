// ==========================================
// 1) Node.js ka built-in HTTP module import kar rahe hain
// Ye module hume server banane ka function deta hai
// ==========================================
const http = require("http");

// ==========================================
// 2) http.createServer() se ek naya server bana rahe hain
// Iske andar ek callback function dete hain jo har incoming request pe chalta hai
// Callback ke do parameters hote hain:
//   - req: Request object (isme method, URL, headers, body ka data hota hai)
//   - res: Response object (isme hum client ko response bhejte hain)
// ==========================================
const server = http.createServer((req, res) => {
  // ==========================================
  // 3) Default header set kar rahe hain
  // 'Content-Type' => "application/json" ka matlab:
  //   Jo bhi data hum bhejenge wo JSON format me hoga
  // ==========================================
  res.setHeader("Content-Type", "application/json");

  // ==========================================
  // 4) Agar request ka method GET hai
  // GET usually data fetch karne ke liye hota hai
  // ==========================================
  if (req.method === "GET") {
    // Client ko JSON response bhejna
    res.end(JSON.stringify({ message: "GET request - Data fetch kiya" }));
  }

  // ==========================================
  // 5) Agar request ka method POST hai
  // POST ka use naya data server pe bhejne (create karne) ke liye hota hai
  // ==========================================
  else if (req.method === "POST") {
    // Ek empty string banate hain jisme request ka data store hoga
    let body = "";

    // 'data' event tab chalta hai jab client thoda thoda karke data bhejta hai
    req.on("data", (chunk) => {
      // Har aane wale chunk ko body string me add kar dete hain
      body += chunk;
    });

    // 'end' event tab chalta hai jab pura data receive ho jata hai
    req.on("end", () => {
      // String ko JSON object me parse karte hain
      const data = JSON.parse(body);

      // Client ko confirm karte hain ke data receive ho gaya
      res.end(
        JSON.stringify({ message: "POST request - Data receive hua", data })
      );
    });
  }

  // ==========================================
  // 6) Agar request ka method PUT hai
  // PUT ka use existing resource ko pura replace karne ke liye hota hai
  // ==========================================
  else if (req.method === "PUT") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      // Confirm karte hain ke pura data replace hua
      res.end(
        JSON.stringify({ message: "PUT request - Pura data replace hua", data })
      );
    });
  }

  // ==========================================
  // 7) Agar request ka method PATCH hai
  // PATCH ka use existing resource me sirf kuch fields update karne ke liye hota hai
  // ==========================================
  else if (req.method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);
      // Confirm karte hain ke partial update hua
      res.end(
        JSON.stringify({
          message: "PATCH request - Partially update hua",
          data,
        })
      );
    });
  }

  // ==========================================
  // 8) Agar request ka method DELETE hai
  // DELETE ka use resource delete karne ke liye hota hai
  // ==========================================
  else if (req.method === "DELETE") {
    // Simple confirmation message bhejna
    res.end(JSON.stringify({ message: "DELETE request - Data delete hua" }));
  }

  // ======================================================================
  // 9) Agar koi unknown method use ho (GET/POST/PUT/PATCH/DELETE ke ilawa)
  // To server 405 (Method Not Allowed) return karega
  // ==================================================================
  else {
    res.statusCode = 405;
    res.end(JSON.stringify({ message: "Method not allowed" }));
  }
});

// =================================================================
// 10) Server ko start karte hain port 8000 pe
// Jab server start hota hai to console me ek message print hota hai
// ==================================================================
server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
//------------------------------------------------------------------|
