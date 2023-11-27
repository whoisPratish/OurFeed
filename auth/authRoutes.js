const express = require("express");
const router = express.Router();

// Sample user data.
const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" },
];


router.get("/", (req, res) => {

    try {
        res.render("/login");
    } catch (error) {
        console.log(error);
    }
  
});

// Login route
router.get("/login", (req, res) => {
    res.render("views/login", { error: req.flash("error") });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Simple authentication logic
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
        // Set user information in session
        req.session.user = user;

        res.redirect("/feed");
    } else {
        // Use flash to display an error message on unsuccessful login
        req.flash("error", "Invalid username or password");
        res.redirect("/login");
    }
});

// Register route
router.get("/register", (req, res) => {
    res.render("views/register");
});

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Simple registration logic
    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);

    // Set user information in session
    req.session.user = newUser;

    res.redirect("/feed"); // Redirect to feed after successful registration
});

// Logout route
router.get("/logout", (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy((err) => {
        res.redirect("/"); // Redirect to the home page after logout
    });
});

module.exports = router;
