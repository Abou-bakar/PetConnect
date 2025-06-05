const express = require("express");
const router = express.Router();
const socialController = require("../controllers/socialController");
const multer = require("multer");
const path = require("path");

const {
    createPost,
    getAllPosts,
    deletePost,
    addComment,
    toggleLike, 
  } = require("../controllers/socialController"); 

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  },
});
const upload = multer({ storage });

// Create post with optional media
router.post("/posts", upload.single("media"), socialController.createPost);
router.post("/posts", socialController.createPost);
router.get("/posts", socialController.getAllPosts);
router.post("/posts/:postId/comment", socialController.addComment);
router.delete("/posts/:postId", socialController.deletePost);
router.post("/toggle-like", toggleLike);

module.exports = router;
