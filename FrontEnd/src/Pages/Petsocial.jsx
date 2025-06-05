import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const currentUser = localStorage.getItem("username") || "Guest";

export default function Petsocial() {
  const [posts, setPosts] = useState([]);
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("email") || ""
  );
  const [newPost, setNewPost] = useState("");
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("Fetching posts for:", userEmail);
    fetchPosts();
  }, [userEmail]);

  const fetchPosts = () => {
    axios
      .get("http://localhost:5000/api/social/posts", {
        params: { userEmail },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Failed to fetch posts:", err));
  };

  const handleLike = async (postId) => {
    try {
      console.log("Liking post:", postId);
      await axios.post("http://localhost:5000/api/social/toggle-like", {
        postId,
        userEmail,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/social/posts/${postId}`);
        setPosts(posts.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !newPostMedia) return;

    const formData = new FormData();
    formData.append("user_email", userEmail);
    formData.append("content", newPost);
    if (newPostMedia) {
      formData.append("media", newPostMedia);
    }

    try {
      await axios.post("http://localhost:5000/api/social/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchPosts();
      setNewPost("");
      setNewPostMedia(null);
      setMediaPreviewUrl(null);
      fileInputRef.current.value = null;
    } catch (error) {
      console.error("Post failed:", error);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPostMedia(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      try {
        await axios.post(
          `http://localhost:5000/api/social/posts/${postId}/comment`,
          {
            user: currentUser,
            content: newComment,
          }
        );
        fetchPosts();
        setNewComment("");
        setSelectedPostId(null);
      } catch (error) {
        console.error("Comment failed:", error);
      }
    }
  };

  const handleShare = async (post) => {
    try {
      await navigator.share({
        title: "Check out this post!",
        text: post.content,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Sharing failed:", err);
    }
  };

  const handleReport = (postId) => {
    if (window.confirm("Are you sure you want to report this post?")) {
      setPosts(posts.filter((post) => post.id !== postId));
      alert("Post reported and removed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="py-4 bg-[#65cadc] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-4xl font-bold text-center">Pet Connect</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {/* <Link to="/Messages" className="hover:text-blue-600">
                💌 Messages
              </Link> */}
              {/* <Link to="/PetProfile" className="hover:text-blue-600">
                👤 Profile
              </Link> */}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              ☰
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            <Link
              to="/Messages"
              className="block p-2 hover:bg-gray-100 rounded"
            >
              💌 Messages
            </Link>
            <Link
              to="/PetProfile"
              className="block p-2 hover:bg-gray-100 rounded"
            >
              👤 Profile
            </Link>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 border rounded-lg"
                rows="3"
              />
              {mediaPreviewUrl && (
                <div className="relative">
                  {newPostMedia.type.startsWith("video") ? (
                    <video
                      src={mediaPreviewUrl}
                      controls
                      className="w-full rounded-lg mb-4 max-h-64 object-cover"
                    />
                  ) : (
                    <img
                      src={mediaPreviewUrl}
                      className="w-full rounded-lg mb-4 max-h-64 object-cover"
                      alt="Preview"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setNewPostMedia(null);
                      setMediaPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex justify-between items-center">
                <div className="space-x-4">
                  <input
                    type="file"
                    accept="image/*, video/*"
                    onChange={handleMediaUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="hover:bg-gray-100 p-2 rounded"
                  >
                    📸 Add Photo/Video
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* Post Feed */}
          {/* ...your existing code above remains unchanged... */}

          {/* Post Feed */}
          {posts.map((post) => (
            <div
              key={post.post_id}
              className="bg-white rounded-lg shadow p-6 position-relative"
            >
              <div className="flex items-center space-x-3 mb-4">
                {post.image_url &&
                  (post.image_url.endsWith(".mp4") ||
                  post.image_url.endsWith(".webm") ? (
                    <video
                      src={`http://localhost:5000/uploads/${post.image_url}`}
                      controls
                      className="max-w-xs rounded"
                    />
                  ) : (
                    <img
                      src={`http://localhost:5000/uploads/${post.image_url}`}
                      alt="post"
                      className="max-w-xs rounded"
                    />
                  ))}

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{post.user}</h3>
                      <p style={{ fontSize: "12px", color: "gray" }}>
                        {moment(post.created_at).fromNow()}
                      </p>
                    </div>
                    {post.user === currentUser && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑 Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <p className="mb-4">{post.content}</p>
              <div className="flex space-x-6 text-gray-600">
                <button
                  onClick={() => handleLike(post.post_id)}
                  className="flex items-center hover:text-blue-500"
                >
                  {post.liked_by?.includes(currentUser) ? "❤" : "🤍"}{" "}
                  {post.like_count}
                </button>
                <button
                  onClick={() =>
                    setSelectedPostId(
                      post.id === selectedPostId ? null : post.id
                    )
                  }
                  className="hover:text-blue-500"
                >
                  💬 Comment (
                  {Array.isArray(post.comments) ? post.comments.length : 0})
                </button>
                <button
                  onClick={() => handleShare(post)}
                  className="hover:text-blue-500"
                >
                  ↪ Share
                </button>
                <button
                  onClick={() => handleReport(post.id)}
                  className="hover:text-red-500"
                >
                  ⚠ Report
                </button>
              </div>

              {selectedPostId === post.id && (
                <div className="mt-4">
                  <div className="space-y-2">
                    {Array.isArray(post.comments) &&
                      post.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <span className="font-bold">{comment.user}:</span>
                          <span>{comment.content}</span>
                        </div>
                      ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#65cadc] text-white py-6 text-center">
        <p>© 2024 Pet Connect. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
