const nodemailer = require("nodemailer");
const { connectDatabase } = require("../config/db");
const cron = require("node-cron");
require("dotenv").config();

const db = connectDatabase();

// Gmail transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Format date to YYYY-MM-DD using local time to avoid timezone mismatch
const getTodayDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
};

// Main function to check and send reminders
const checkAndSendReminders = () => {
  const today = getTodayDate();

  const query = "SELECT * FROM reminders WHERE date = ? AND status = 'pending'";
  db.query(query, [today], (err, results) => {
    if (err) {
      console.error("❌ Error fetching reminders:", err);
      return;
    }

    if (results.length === 0) {
      console.log("ℹ️ No pending reminders for today.");
      return;
    }

    console.log("📬 Pending reminders found:", results.length);

    results.forEach((reminder) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: "📅 Reminder Notification",
        text: `Hello,\n\nThis is your reminder:\n\n${reminder.message}\n\nHave a great day!`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Failed to send email:", error);
        } else {
          console.log(`✅ Email sent to ${reminder.email}:`, info.response);

          const updateQuery =
            "UPDATE reminders SET status = 'sent' WHERE id = ?";
          db.query(updateQuery, [reminder.id], (err, result) => {
            if (err) {
              console.error("❌ Failed to update reminder status:", err);
            } else {
              console.log(
                `✅ Reminder ID ${reminder.id} status updated to 'sent'.`
              );
            }
          });
        }
      });
    });
  });
};

// Schedule to run every minute
cron.schedule("* * * * *", () => {
  console.log("⏰ Running reminder check every minute...");
  checkAndSendReminders();
});

// Run immediately on script start
checkAndSendReminders();
