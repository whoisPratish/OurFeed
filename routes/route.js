const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../auth/authMiddleware"); 
const PostModel = require("../database/models/post");

// Multer setup for handling file uploads
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Home route
router.get("/", (req, res) => {
  res.render("home", { userAuthenticated: req.session.user });
});

// Feed route
router.get("/feed", async (req, res) => {
  const posts = await PostModel.find({});
  if (posts) {
    res.render("index", {
      posts: posts,
      userAuthenticated: req.session.user,
    });
  } else {
    res.render("index", { userAuthenticated: req.session.user });
  }
});

// Submit a post route
router.post("/posts", authMiddleware, upload.single("image"), async (req, res) => {
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

// Delete a post route
router.post("/posts/delete/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await PostModel.findByIdAndDelete(id);
    res.redirect("/feed");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Edit a post route
router.get("/posts/edit/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await PostModel.findOne({ _id: id });
    res.render("edit", {
      post: post,
      userAuthenticated: req.session.user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/posts/edit/:id", authMiddleware, async (req, res) => {
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
