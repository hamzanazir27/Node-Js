const { validateToken } = require("../services/authentication");

function authenticztionForValidateUser(token) {
  return (req, res, next) => {
    const tokenCookie = req?.cookies[token];
    // console.log("middleware authe -> tokenCookie -> ", tokenCookie);

    if (!tokenCookie) {
      return next();
    }

    try {
      const user = validateToken(tokenCookie);
      //   console.log("middleware authe -> cookie user -> ", user);
      req.user = user;
    } catch (error) {}
    return next();
  };
}

module.exports = { authenticztionForValidateUser };
