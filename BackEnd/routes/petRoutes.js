const express = require("express");
const {
  getAllPets,
  addPet,
  updatePet,
  deletePet,
  sendAdoptionRequest,
  getAdoptionRequests,
  approveRequest,
  rejectRequest,
  deleteRequest,
} = require("../controllers/petController");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.get("/", getAllPets);
router.post("/add-pet", upload.single("image"), addPet);
router.put("/:id", upload.single("image"), updatePet);
router.delete("/:id", deletePet);
router.post("/send-adoption-request", sendAdoptionRequest);
router.get("/adoption-requests", getAdoptionRequests);
router.put("/adoption-requests/:id/approve", approveRequest);
router.put("/adoption-requests/:id/reject", rejectRequest);
router.delete("/adoption-requests/:id", deleteRequest);

module.exports = router;
