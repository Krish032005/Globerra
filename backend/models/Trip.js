const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    boarding: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    budget: {
      type: String,
    },

    days: {
      type: Number,
      required: true,
    },

    travellers: {
      type: Number,
      required: true,
    },

    travel_date: {
      type: Date,
      required: true,
    },

    return_date: {
      type: Date,
      required: true,
    },

    interests: {
      type: String,
      default: "",
    },

    generated_plan: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trip", tripSchema);