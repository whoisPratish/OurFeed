const express = require("express");
const router = express.Router();

// Sample user data. 
const users = [
    { id: 1, username: "user1", password: "password1" },
    { id: 2, username: "user2", password: "password2" },
];

// Login route
router.get("/login", (req, res) => {
    res.render("auth/login");
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
        res.render("auth/login", { error: "Invalid username or password" });
    }
});

// Register route
router.get("/register", (req, res) => {
    res.render("auth/register");
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

module.exports = router;
