const fs = require("fs");

// Logging middleware function
function logReqRes(filename) {
  return function (req, res, next) {
    fs.appendFile(
      filename,
      `${Date.now()}: ${req.method} ${req.path}\n`,
      (err) => {
        if (err) console.log(err);
        next();
      }
    );
  };
}

module.exports = { logReqRes };
