const express = require("express");
const router = express.Router();
const { saveReview, getReviews } = require("../controllers/reviewController");

router.get("/", getReviews);
router.post("/", saveReview);

module.exports = router;