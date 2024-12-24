const jwt = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.redirect("/login");
    }

    req.user = decoded; // Add user info to request object
    next();
  });
};
