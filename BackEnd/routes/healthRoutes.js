const express = require("express");
const router = express.Router();
const {
  addHealthRecord,
  getHealthRecords,
  updateHealthRecord,
  deleteHealthRecord,
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  getAllReminders,
  getAllAdminReminders
} = require("../controllers/healthController");
const authenticateToken = require("../middlewares/authMiddleware");
const verifyToken  = require("../middlewares/authMiddleware"); // If you use token verification
// Now use authenticateToken everywhere 👇
router
  .route("/records")
  .get(authenticateToken, getHealthRecords)
  .post(authenticateToken, addHealthRecord);

router
  .route("/records/:id")
  .put(authenticateToken, updateHealthRecord)
  .delete(authenticateToken, deleteHealthRecord);

router
  .route("/reminders")
  .get(authenticateToken, getReminders)
  .post(authenticateToken, addReminder);

router
  .route("/reminders/:id")
  .put(authenticateToken, updateReminder)
  .delete(authenticateToken, deleteReminder);

router.get("/admin/reminders", verifyToken, getAllAdminReminders);

module.exports = router;