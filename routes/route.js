const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const PostModel = require("../database/models/post");
router.get("/", (req, res, next) => {
  res.render("home");
});
router.get("/feed", async (req, res, next) => {
  const posts = await PostModel.find({});
  if (posts) {
    res.render("index", {
      posts: posts,
    });
  } else {
    res.render("index");
  }
});

//submit a post
router.post("/posts", upload.single("image"), async (req, res) => {
  const { text } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const post = new PostModel({
    caption: text,
    image: imagePath,
  });

  try {
    const newPost = await post.save();
    res.status(201).redirect("/feed");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post("/posts/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await PostModel.findByIdAndDelete(id);
    res.redirect("/feed");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/posts/edit/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findOne({ _id: id });
    res.render("edit", {
      post: post,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/posts/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { caption: text },
      { new: true }
    );
    res.redirect("/feed");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Serve static images
router.use("/uploads", express.static("uploads"));

module.exports = router;
