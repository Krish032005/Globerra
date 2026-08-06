const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

exports.createBooking = async (req, res) => {
  try {
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
console.log("Request Body:", req.body);
    const booking = await Booking.create({
      user_id,
      hotel_id,
      check_in,
      check_out,
      adults,
      children,
      rooms,
      extra_bed,
      total_amount,
    });

    res.status(201).json({
      message: "Booking successful",
      bookingId: booking._id,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Booking failed",
    });

  }
};

exports.getBookingById = async (req, res) => {

  try {

    const booking = await Booking.findById(req.params.id)
      .populate("hotel_id");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });

  }

};

exports.getBookingsByUser = async (req, res) => {

  try {

    const bookings = await Booking.find({
      user_id: req.params.userId,
    })
      .populate("hotel_id")
      .sort({
        createdAt: -1,
      });

    res.json(bookings);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch user bookings",
    });

  }

};

exports.updateBookingCustomer = async (req, res) => {

  try {

    const {
      guest_name,
      guest_email,
      guest_phone,
      guest_address,
    } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        guest_name,
        guest_email,
        guest_phone,
        guest_address,
      },
      {
        new: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Customer details updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to update booking details",
    });

  }

};