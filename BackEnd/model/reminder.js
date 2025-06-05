const { connectDatabase } = require("../config/db"); // Import connectDatabase function

// Example function to add a reminder
const addReminder = (message, date, email) => {
  const db = connectDatabase(); // Create a database connection
  const query =
    "INSERT INTO reminders (message, date, email, status) VALUES (?, ?, ?, ?)";
  db.query(query, [message, date, email, "pending"], (err, result) => {
    if (err) {
      console.error("Error inserting reminder:", err);
      return;
    }
    console.log("Reminder added:", result);
  });
  db.end(); // Close the database connection
};

// Example function to get reminders
const getReminders = (date) => {
  const db = connectDatabase(); // Create a database connection
  const query = "SELECT * FROM reminders WHERE date = ? AND status = ?";
  db.query(query, [date, "pending"], (err, results) => {
    if (err) {
      console.error("Error fetching reminders:", err);
      return;
    }
    console.log("Reminders:", results);
  });
  db.end(); // Close the database connection
};

module.exports = { addReminder, getReminders };
