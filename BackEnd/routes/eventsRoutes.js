const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware"); // Import Multer middleware
const { getEvents, addEvent, updateEvent, deleteEvent } = require("../controllers/eventsController");

router.get("/events", getEvents);
router.post("/events", upload.single("image"), addEvent);
router.put("/events/:id", upload.single("image"), updateEvent);
router.delete("/events/:id", deleteEvent);

module.exports = router;