const db = require("../config/db");

exports.saveReview = (req, res) => {
  const { user_id, name, email, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required" });
  }

  const sql = `
    INSERT INTO reviews (user_id, name, email, message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id || null,
      name || "Guest User",
      email || "guest@example.com",
      message.trim(),
    ],
    (err, result) => {
      if (err) {
        console.error("Error saving review:", err);
        return res.status(500).json({ message: "Failed to save review" });
      }

      res.status(201).json({
        message: "Review saved successfully",
        id: result.insertId,
      });
    }
  );
};

exports.getReviews = (req, res) => {
  const sql = "SELECT * FROM reviews ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching reviews:", err);
      return res.status(500).json({ message: "Failed to fetch reviews" });
    }

    res.status(200).json(result);
  });
};