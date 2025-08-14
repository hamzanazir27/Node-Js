console.log("heeloo");
const http = require("http");

const myserver = http.createServer((req, res) => {
  console.log("enter to my server"); // 2. jese hi browser pe http://localhost:8000 krain tu console.log hoga
  console.log(req.headers); //3 req jis server se aye gi os ka data hoga
  res.end("hello from myserver"); //4 ye browser pe data show hoga
});

myserver.listen(8000, () => {
  console.log("Server Start"); // 1 jb node index.js krain gey tu serer start hojaye ga
});

// http://localhost:8000
