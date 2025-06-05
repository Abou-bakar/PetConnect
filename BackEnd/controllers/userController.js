const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectDatabase } = require("../config/db");
const db = connectDatabase();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const role = "user";

  try {
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required.");
    }

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) return res.status(500).send("Database error.");
      if (results.length > 0)
        return res.status(400).send("Email already exists.");

      const hashedPassword = await bcrypt.hash(password, 10);
      const sql =
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(sql, [name, email, hashedPassword, role], (err) => {
        if (err) return res.status(500).send("Signup error.");
        res.status(201).send("Signup successful!");
      });
    });
  } catch {
    res.status(500).send("Server error.");
  }
};

const login = (req, res) => {
  const { email, password } = req.body; // ✅ only use email and password

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).send("Invalid email or password.");

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).send("Invalid email or password.");

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      role: user.role, // ✅ send correct role from DB
    });
  });
};

module.exports = { signup, login };
