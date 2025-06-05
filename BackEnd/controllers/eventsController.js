const { connectDatabase } = require("../config/db");
const { sendEventNotification } = require("../utils/emailService");

exports.getEvents = (req, res) => {
  const db = connectDatabase();
  db.query("SELECT * FROM events", (err, results) => {
    db.end();
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.addEvent = (req, res) => {
  const db = connectDatabase();
  const { title, date, description } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const sql =
    "INSERT INTO events (title, date, description, image_url) VALUES (?, ?, ?, ?)";

  db.query(sql, [title, date, description, image_url], (err, result) => {
    db.end(); // Close initial connection

    if (err) return res.status(500).json({ error: err.message });

    // Fetch all registered users
    const userDb = connectDatabase();
    userDb.query("SELECT email FROM users", async (err, users) => {
      userDb.end(); // Close user connection

      if (err) {
        console.error("Failed to fetch users:", err);
        return res.status(500).json({
          error: "Event added, but failed to notify users.",
          id: result.insertId,
        });
      }

      // Send emails to all users
      const eventDetails = {
        title,
        date: new Date(date).toLocaleDateString("en-US"),
        description,
        image_url,
      };

      try {
        await Promise.all(
          users.map((user) => sendEventNotification(user.email, eventDetails))
        );
        res.json({
          message: "Event added and users notified!",
          id: result.insertId,
        });
      } catch (emailError) {
        console.error("Partial email failure:", emailError);
        res.json({
          message: "Event added, but some emails failed to send.",
          id: result.insertId,
        });
      }
    });
  });
};

exports.updateEvent = (req, res) => {
  const db = connectDatabase();
  const { title, date, description } = req.body;
  const { id } = req.params;

  db.query(
    "SELECT image_url FROM events WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const existingImage = results[0]?.image_url;
      const image_url = req.file
        ? `/uploads/${req.file.filename}`
        : existingImage;

      const sql =
        "UPDATE events SET title=?, date=?, description=?, image_url=? WHERE id=?";
      db.query(sql, [title, date, description, image_url, id], (err) => {
        db.end();
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Event updated successfully" });
      });
    }
  );
};

exports.deleteEvent = (req, res) => {
  const db = connectDatabase();
  const { id } = req.params;
  db.query("DELETE FROM events WHERE id=?", [id], (err) => {
    db.end();
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Event deleted successfully" });
  });
};
