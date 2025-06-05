const socialModel = require("../model/socialModel");
const path = require("path");
const { connectDatabase } = require("../config/db");

exports.createPost = (req, res) => {
  const content = req.body.content;
  const user_email = req.body.user_email;
  const file = req.file;
  const image_url = file ? file.filename : null;

  const post = { user_email, content, image_url };

  socialModel.createPost(post, (err, result) => {
    if (err) {
      console.error("Error creating post:", err);
      return res.status(500).json({ message: "Failed to create post" });
    }

    const newPost = {
      id: result.insertId,
      user_email,
      content,
      image_url,
      created_at: new Date(),
      comments: [],
      likedBy: [],
    };

    res.status(201).json(newPost);
  });
};

exports.getAllPosts = (req, res) => {
  const db = connectDatabase();

  const query = `
  SELECT 
    p.post_id, 
    p.user_email, 
    p.content, 
    p.image_url, 
    p.created_at, 
    COUNT(DISTINCT l.id) AS like_count,
    GROUP_CONCAT(DISTINCT l.user_email) AS liked_by,
    COUNT(DISTINCT c.id) AS comment_count
  FROM social_posts p
  LEFT JOIN likes l ON p.post_id = l.post_id
  LEFT JOIN comments c ON p.post_id = c.post_id
  GROUP BY p.post_id
  ORDER BY p.created_at DESC
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      db.end(); // Close connection in case of error
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const posts = results.map((post) => ({
      ...post,
      liked_by: post.liked_by ? post.liked_by.split(",") : [],
    }));

    db.end();
    res.json(posts);
  });
};
// Like/Unlike Post
exports.toggleLike = (req, res) => {
  const { postId, userEmail } = req.body;

  const checkQuery = "SELECT * FROM likes WHERE post_id = ? AND user_email = ?";
  const insertQuery = "INSERT INTO likes (post_id, user_email) VALUES (?, ?)";
  const deleteQuery = "DELETE FROM likes WHERE post_id = ? AND user_email = ?";

  connectDatabase((connection) => {
    connection.query(checkQuery, [postId, userEmail], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        // Unlike
        connection.query(deleteQuery, [postId, userEmail], (err2) => {
          if (err2) return res.status(500).json({ error: "Error unliking" });
          res.json({ liked: false });
        });
      } else {
        // Like
        connection.query(insertQuery, [postId, userEmail], (err2) => {
          if (err2) return res.status(500).json({ error: "Error liking" });
          res.json({ liked: true });
        });
      }
    });
  });
};

// Add comment
exports.addComment = async (req, res) => {
  const { postId, content } = req.body;

  try {
    // Call the model function
    const commentId = await socialModel.addComment(postId, content);

    // Send a response with the inserted comment's ID or success message
    res.status(200).json({ success: true, commentId });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Delete post
exports.deletePost = (req, res) => {
  const { postId } = req.params;
  const { user } = req.body;

  if (!user) return res.status(400).json({ error: "User is required" });

  socialModel.deletePost(postId, user, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Post deleted" });
  });
};
