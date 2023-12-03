// const mongodb = require("mongoose");
// require("dotenv").config();
// const uri = process.env.URI;
// mongodb.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });



const mongoose = require("mongoose");
require("dotenv").config();

// URI from the .env file
const uri = process.env.URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Export the connection object
module.exports = mongoose.connection;
