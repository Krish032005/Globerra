const db = require("../config/db");

exports.createBooking = (req, res) => {
  const user_id = req.user.id;
  const {
    hotel_id,
    check_in,
    check_out,
    adults,
    children,
    rooms,
    extra_bed,
    total_amount,
  } = req.body;

  const sql = `
    INSERT INTO bookings
    (user_id, hotel_id, check_in, check_out, adults, children, rooms, extra_bed, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, hotel_id, check_in, check_out, adults, children, rooms, extra_bed, total_amount],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Booking failed" });

      res.status(201).json({
        message: "Booking successful",
        bookingId: result.insertId,
      });
    }
  );
};

exports.getBookingById = (req, res) => {
  const bookingId = req.params.id;

  const sql = `
    SELECT b.*, h.hotel_name, h.location, h.price_per_night, h.image_url
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    WHERE b.id = ?
  `;

  db.query(sql, [bookingId], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch booking" });
    if (result.length === 0) return res.status(404).json({ message: "Booking not found" });
    res.json(result[0]);
  });
};

exports.getBookingsByUser = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      b.*, 
      h.hotel_name, 
      h.location, 
      h.price_per_night, 
      h.image_url
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.id
    WHERE b.user_id = ?
    ORDER BY b.id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch user bookings" });
    }

    res.json(result);
  });
};

exports.updateBookingCustomer = (req, res) => {
  const bookingId = req.params.id;
  const { guest_name, guest_email, guest_phone, guest_address } = req.body;

  const sql = `
    UPDATE bookings
    SET guest_name = ?, guest_email = ?, guest_phone = ?, guest_address = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [guest_name, guest_email, guest_phone, guest_address, bookingId],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to update booking details" });

      res.json({ message: "Customer details updated successfully" });
    }
  );
};