const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require('crypto');

const authMiddleware=require("./auth/authMiddleware");
const authRoutes=require("./auth/authRoutes");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");


app.use(authMiddleware);
app.use(authRoutes);
// Database connection setup
const connection = require("./database/connection");
connection.once('open', function () {
    console.log('Database connected successfully');
});

// Dummy user for testing purposes (replace with your actual user model)
const dummyUser = {
    id: 1,
    username: 'testuser',
    password: 'testpassword' // Hash this in a real application
};

// Middleware setup
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Express session and passport setup
app.use(session({
    secret: crypto.randomBytes(20).toString('hex'),
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy for login
passport.use(new LocalStrategy(
    function(username, password, done) {
        // Replace this with your actual authentication logic
        if (username === dummyUser.username && password === dummyUser.password) {
            return done(null, dummyUser);
        } else {
            return done(null, false, { message: 'Invalid credentials' });
        }
    }
));

// Serialize user information for session storage
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserialize user information from session storage
passport.deserializeUser(function(id, done) {
    // Replace this with your logic to fetch user information from the database
    if (id === dummyUser.id) {
        done(null, dummyUser);
    } else {
        done(null, false);
    }
});

// Routes setup
const routes = require("./routes/route");
const authMiddleware = require("./auth/authMiddleware");
const authRoutes = require("./auth/authRoutes");

app.use(authMiddleware);
app.use("/auth", authRoutes);
app.use(routes);

// Port setup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
