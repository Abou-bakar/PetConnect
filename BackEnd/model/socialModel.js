const { connectDatabase } = require("../config/db");

// Create a database connection
const db = connectDatabase();

// Get all posts
exports.getAllPosts = (callback) => {
  const query = "SELECT * FROM social_posts ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Create a new post
exports.createPost = (post, callback = () => {}) => {
  const query =
    "INSERT INTO social_posts (user_email, content, image_url) VALUES (?, ?, ?)";
  const values = [post.user_email, post.content, post.image_url];
  db.query(query, values, (err, result) => {
    callback(err, result);
  });
};

// Like a post
exports.likePost = (postId, callback) => {
  const query = "UPDATE social_posts SET likes = likes + 1 WHERE id = ?";
  db.query(query, [postId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Delete a post
exports.deletePost = (postId, callback) => {
  const query = "DELETE FROM social_posts WHERE id = ?";
  db.query(query, [postId], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

exports.addComment = async (postId, content) => {
  try {
    // Perform the insert query
    const result = await db.query(
      "INSERT INTO comments (post_id, content, created_at) VALUES (?, ?, ?)",
      [postId, content, new Date()]
    );

    // Return only the insertId (or any other relevant data you need)
    return result.insertId; // You could also return any other data from the query
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error; // Rethrow the error to be handled by the controller
  }
};
