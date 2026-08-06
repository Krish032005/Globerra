const Review = require("../models/Review");

exports.saveReview = async (req, res) => {
  try {
    const { user_id, name, email, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const review = await Review.create({
      user_id: user_id || null,
      name: name || "Guest User",
      email: email || "guest@example.com",
      message: message.trim(),
    });

    res.status(201).json({
      message: "Review saved successfully",
      id: review._id,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to save review",
    });

  }
};

exports.getReviews = async (req, res) => {

  try {

    const reviews = await Review.find().sort({
      createdAt: -1,
    });

    res.status(200).json(reviews);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });

  }

};