const db = require("../config/db");

exports.getHotels = (req, res) => {
   const limit = parseInt(req.query.limit) || 5;

    let sql = "SELECT * FROM hotels";

  if (limit) {
    sql += " LIMIT ?";
  }
  
  db.query("SELECT * FROM hotels", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch hotels" });
    }
    res.json(result);
  });
};

exports.getHotelById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM hotels WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch hotel" });
    if (result.length === 0) return res.status(404).json({ message: "Hotel not found" });
    res.json(result[0]);
  });
};

exports.getHotelsByDestination = (req, res) => {
  const { destination } = req.params;

  const sql = "SELECT * FROM hotels WHERE LOWER(location) = LOWER(?)";
  db.query(sql, [destination], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
};

// const db = require("../config/db");

exports.getBookingsByUser = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      b.id,
      b.user_id,
      b.hotel_id,
      b.check_in,
      b.check_out,
      b.adults,
      b.children,
      b.rooms,
      b.total_amount,
      h.name AS hotel_name,
      h.location,
      h.room_image,
      h.image_url
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    WHERE b.user_id = ?
    ORDER BY b.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user bookings:", err);
      return res.status(500).json({ message: "Failed to fetch user bookings" });
    }

    res.json(result);
  });
};