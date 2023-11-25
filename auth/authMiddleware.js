const authMiddleware = (req, res, next) => {
    // Check if the user is authenticated
    if (req.session.user) {
        // User is authenticated, proceed to the next middleware or route
        next();
    } else {
        // User is not authenticated, redirect to login page
        res.redirect("/auth/login");
    }
};

module.exports = authMiddleware;
