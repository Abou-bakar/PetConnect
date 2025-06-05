const { connectDatabase } = require("../config/db");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/email");

const db = connectDatabase();

// ✅ Get Health Records
exports.getHealthRecords = (req, res) => {
  const email = req.user.email;
  const query = `SELECT * FROM health_records WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("❌ Error fetching health records:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(200).json(results);
  });
};

// ✅ Add Health Record
exports.addHealthRecord = (req, res) => {
  const { petName, vaccine, date } = req.body;
  const email = req.user.email;

  if (!petName || !vaccine || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO health_records(petName, vaccine, date, email) VALUES (?, ?, ?, ?)`;
  db.query(query, [petName, vaccine, date, email], (err, results) => {
    if (err) {
      console.error("❌ Error adding health record:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json({ message: "Health record added successfully" });
  });
};

// ✅ Update Health Record
exports.updateHealthRecord = (req, res) => {
  const { id } = req.params;
  const { petName, vaccine, date } = req.body;

  db.query(
    "UPDATE health_records SET petName = ?, vaccine = ?, date = ? WHERE id = ?",
    [petName, vaccine, date, id],
    (err, results) => {
      if (err) {
        console.error("❌ Error updating health record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ message: "Health record updated successfully" });
    }
  );
};

// ✅ Delete Health Record
exports.deleteHealthRecord = (req, res) => {
  const email = req.user.email;
  const { id } = req.params;

  db.query(
    "DELETE FROM health_records WHERE id = ? AND email = ?",
    [id, email],
    (err, results) => {
      if (err) {
        console.error("❌ Error deleting health record:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json({ message: "Health record deleted successfully" });
    }
  );
};

// ✅ Get Reminders
exports.getReminders = (req, res) => {
  const email = req.user.email;

  db.query(
    "SELECT * FROM reminders WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("❌ Error fetching reminders:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.status(200).json(results);
    }
  );
};

exports.getAllAdminReminders = (req, res) => {
  const query = `
    SELECT reminders.*, users.email 
    FROM reminders 
    INNER JOIN users ON reminders.user_id = users.id
    ORDER BY reminders.date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching admin reminders:", err);
      return res.status(500).json({ message: "Failed to fetch reminders" });
    }
    res.json(results);
  });
};

// module.exports = { getAllAdminReminders };

// ✅ Add Reminder
exports.addReminder = (req, res) => {
  const { message, date } = req.body;
  const userId = req.user.id;
  const email = req.user.email;

  if (!message || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "INSERT INTO reminders (email, message, date, status, user_id) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [email, message, date, "pending", userId], (err, result) => {
    if (err) {
      console.error("❌ Error adding reminder:", err);
      return res.status(500).json({ message: "Server error" });
    }

    // Send reminder email
    sendEmail(email, message);

    res.status(201).json({
      message: "Reminder added successfully and email sent.",
      reminderId: result.insertId,
    });
  });
};

// ✅ Update Reminder
exports.updateReminder = (req, res) => {
  const reminderId = req.params.id;
  const { message, date } = req.body;

  if (!message || !date) {
    return res
      .status(400)
      .json({ error: "Both message and date are required" });
  }

  db.query(
    "UPDATE reminders SET message = ?, date = ?, status = ? WHERE id = ?",
    [message, date, "pending", reminderId],
    (err, results) => {
      if (err) {
        console.error("❌ Error updating reminder:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Reminder not found" });
      }

      res.status(200).json({ message: "Reminder updated successfully" });
    }
  );
};

// ✅ Delete Reminder
exports.deleteReminder = (req, res) => {
  const reminderId = req.params.id;

  const query = "DELETE FROM reminders WHERE id = ?";
  db.query(query, [reminderId], (err, result) => {
    if (err) {
      console.error("❌ Error deleting reminder:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  });
};

// ✅ Update Reminder Status
exports.sendReminder = (reminderId) => {
  const query = "UPDATE reminders SET status = ? WHERE id = ?";
  db.query(query, ["sent", reminderId], (err, result) => {
    if (err) {
      console.error("❌ Error updating reminder status:", err);
    } else {
      console.log("✅ Reminder status updated to 'sent'");
    }
  });
};
