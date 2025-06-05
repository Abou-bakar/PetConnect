const express = require("express");
const { signup, login } = require("../controllers/userController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { connectDatabase } = require("../config/db"); // ✅ Correct import
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

const db = connectDatabase(); // ✅ Initialize DB connection

router.post("/signup", signup);

// User login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Error comparing passwords" });
      }

      if (isMatch) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          jwtSecret, // 🔐 Replace with process.env.SECRET in real apps
          { expiresIn: "1d" }
        );

        res.json({ token });
      } else {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    });
  });
});

module.exports = router;
