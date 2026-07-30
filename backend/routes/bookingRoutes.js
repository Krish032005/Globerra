const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createBooking,
  getBookingById,
  getBookingsByUser,
  updateBookingCustomer,
} = require("../controllers/bookingController");

router.post("/", authMiddleware, createBooking);
router.get("/user/:userId", authMiddleware, getBookingsByUser);
router.get("/:id", authMiddleware, getBookingById);
router.put("/:id/customer", authMiddleware, updateBookingCustomer);

module.exports = router;