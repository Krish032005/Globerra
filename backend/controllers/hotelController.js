const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

exports.getHotels = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);

    let hotels;

    if (limit && limit > 0) {
      hotels = await Hotel.find().limit(limit);
    } else {
      hotels = await Hotel.find();
    }

    res.json(hotels);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch hotels",
    });

  }
};

exports.getHotelById = async (req, res) => {

  try {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found",
      });
    }

    res.json(hotel);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch hotel",
    });

  }

};

exports.getHotelsByDestination = async (req, res) => {

  try {

    const destination = req.params.destination;

    const hotels = await Hotel.find({
      location: {
        $regex: new RegExp(`^${destination}$`, "i"),
      },
    });

    res.json(hotels);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Database error",
    });

  }

};

exports.getBookingsByUser = async (req, res) => {

  try {

    const bookings = await Booking.find({
      user_id: req.params.userId,
    })
      .populate({
        path: "hotel_id",
        select: "hotel_name location image_url price_per_night",
      })
      .sort({
        createdAt: -1,
      });

    const formattedBookings = bookings.map((booking) => ({
      _id: booking._id,
      user_id: booking.user_id,
      hotel_id: booking.hotel_id?._id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      adults: booking.adults,
      children: booking.children,
      rooms: booking.rooms,
      total_amount: booking.total_amount,
      hotel_name: booking.hotel_id?.hotel_name,
      location: booking.hotel_id?.location,
      image_url: booking.hotel_id?.image_url,
      price_per_night: booking.hotel_id?.price_per_night,
    }));

    res.json(formattedBookings);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user bookings",
    });

  }

};