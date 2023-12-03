const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", "views");

// Initialize MongoDB connection
const connection = require("./database/connection");
connection.once('open', function () {
    console.log('Database connected successfully');
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const routes = require("./routes/route");
app.use(routes);

// Listen to 8080 port
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
