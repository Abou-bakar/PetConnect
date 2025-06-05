// File: routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

// Token validation endpoint (doesn't need a controller)
router.get("/validate", authMiddleware, (req, res) => {
  res.status(200).json({
    valid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

module.exports = router;
