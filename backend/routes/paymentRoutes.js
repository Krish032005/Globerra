const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createCashfreeOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order", authMiddleware, createCashfreeOrder);
router.post("/verify", authMiddleware, verifyPayment);

module.exports = router;