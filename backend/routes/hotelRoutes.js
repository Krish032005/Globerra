const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotelController");
const { getHotels } = require("../controllers/hotelController");


router.get("/", hotelController.getHotels);
router.get("/destination/:destination", hotelController.getHotelsByDestination);
router.get("/:id", hotelController.getHotelById);
router.get("/hotels", getHotels);
module.exports = router;