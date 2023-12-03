const { default: mongoose } = require("mongoose");

const PostSchema = new mongoose.Schema({
  caption: String,
  image: String,
});

module.exports = mongoose.model("Post", PostSchema);
