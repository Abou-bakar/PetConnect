require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDatabase } = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");
const healthRoutes = require("./routes/healthRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const authRoutes = require("./routes/authRoutes");
const socialRoutes = require("./routes/socialRoutes");
const path = require("path");
const nodemailer = require("nodemailer");

require("../BackEnd/Cron/reminderCron"); // Make sure the path is correct

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

connectDatabase();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/health", healthRoutes); // Use health tracking routes
app.use("/api", eventsRoutes);

app.use((err, req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");

  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

app.use("/api/social", socialRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // replace this with your Gmail App Password
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.ADMIN_EMAIL,
    subject: `[Contact Form] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
