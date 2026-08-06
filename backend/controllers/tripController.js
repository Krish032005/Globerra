const Trip = require("../models/Trip");
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.createTrip = async (req, res) => {
  try {
    const {
      user_id,
      boarding,
      destination,
      budget,
      days,
      travellers,
      travel_date,
      return_date,
      interests,
      generated_plan,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const trip = await Trip.create({
      user_id,
      boarding,
      destination,
      budget,
      days,
      travellers,
      travel_date,
      return_date,
      interests,
      generated_plan,
    });

    res.status(201).json({
      message: "Trip saved successfully",
      tripId: trip._id,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to save trip",
    });

  }
};

exports.generateTrip = async (req, res) => {
  try {

    const {
      user_id,
      boarding,
      destination,
      budget,
      days,
      travellers,
      travel_date,
      return_date,
      interests,
    } = req.body;

    if (
      !user_id ||
      !boarding ||
      !destination ||
      !travel_date ||
      !return_date ||
      !days ||
      !travellers
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const prompt = `
Generate a travel itinerary in STRICT JSON format.

Return ONLY JSON.
NO markdown.
NO explanation.

Format:
{
  "days":[
    {
      "day":1,
      "title":"Day title",
      "places":[
        {
          "time":"09:00 AM",
          "placeName":"Place Name",
          "description":"Description",
          "duration":"2 hours",
          "price":"₹500"
        }
      ]
    }
  ]
}

Trip Details:
Boarding: ${boarding}
Destination: ${destination}
Days: ${days}
Budget: ${budget}
Travellers: ${travellers}
Interests: ${interests || "General sightseeing"}
`;

    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const generatedText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let generatedPlan;

    try {

      const cleanText = generatedText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      generatedPlan = JSON.parse(
        cleanText.match(/\{[\s\S]*\}/)[0]
      );

    } catch (err) {

      return res.status(500).json({
        message: "Gemini returned invalid JSON",
        raw: generatedText,
      });

    }

    const trip = await Trip.create({
      user_id,
      boarding,
      destination,
      budget,
      days,
      travellers,
      travel_date,
      return_date,
      interests,
      generated_plan: generatedPlan,
    });

    res.status(201).json({
      message: "Trip generated successfully",
      tripId: trip._id,
      trip,
    });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Trip generation failed",
      error: error.response?.data || error.message,
    });

  }
};

exports.getTripById = async (req, res) => {

  try {

    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.json(trip);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch trip",
    });

  }

};

exports.getLatestTripByDestination = async (req, res) => {

  try {

    const trip = await Trip.findOne({
      destination: req.params.destination,
    }).sort({
      createdAt: -1,
    });

    if (!trip) {
      return res.status(404).json({
        message: "No trip found",
      });
    }

    res.json(trip);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch latest trip",
    });

  }

};

exports.getTripsByUser = async (req, res) => {

  try {

    const trips = await Trip.find({
      user_id: req.params.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(trips);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch user trips",
    });

  }

};