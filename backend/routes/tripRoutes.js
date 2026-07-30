const express = require("express");
const router = express.Router();

const {
  createTrip,
  generateTrip,
  getTripById,
  getLatestTripByDestination,
  getTripsByUser,
} = require("../controllers/tripController");

// save only
router.post("/create", createTrip);

// generate + save
router.post("/generate", generateTrip);

// user trips
router.get("/user/:userId", getTripsByUser);

// latest trip by destination
router.get("/latest/:destination", getLatestTripByDestination);

// single trip by id
router.get("/:id", getTripById);

module.exports = router;