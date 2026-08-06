const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    hotel_name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    price_per_night: {
      type: Number,
      required: true,
    },

    image_url: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },

    total_reviews: {
      type: Number,
      default: 0,
    },

    amenities: [
      {
        type: String,
      },
    ],

    available_rooms: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hotel", hotelSchema);