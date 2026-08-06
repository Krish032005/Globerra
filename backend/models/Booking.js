const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    check_in: {
      type: Date,
      required: true,
    },

    check_out: {
      type: Date,
      required: true,
    },

    adults: {
      type: Number,
      required: true,
      default: 1,
    },

    children: {
      type: Number,
      default: 0,
    },

    rooms: {
      type: Number,
      required: true,
      default: 1,
    },

    extra_bed: {
      type: Number,
      default: 0,
    },

    total_amount: {
      type: Number,
      required: true,
    },

    guest_name: {
      type: String,
      default: "",
    },

    guest_email: {
      type: String,
      default: "",
    },

    guest_phone: {
      type: String,
      default: "",
    },

    guest_address: {
      type: String,
      default: "",
    },

    booking_status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);