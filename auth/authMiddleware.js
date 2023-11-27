// auth/authMiddleware.js
module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
      // User is authenticated, proceed to the next middleware or route handler
      return next();
    } else {
      // User is not authenticated, redirect to login page
      return res.redirect("/login");
    }
  };
  