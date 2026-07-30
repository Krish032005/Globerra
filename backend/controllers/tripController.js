
const db = require("../config/db");
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY loaded:", GEMINI_API_KEY ? "YES" : "NO");

exports.createTrip = (req, res) => {
  console.log("Incoming trip data:", req.body);

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
    return res.status(400).json({ message: "User ID is required" });
  }

  const sql = `
    INSERT INTO trips 
    (user_id, boarding, destination, budget, days, travellers, travel_date, return_date, interests, generated_plan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      boarding,
      destination,
      budget,
      days,
      travellers,
      travel_date,
      return_date,
      interests,
      JSON.stringify(generated_plan || null),
    ],
    (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Failed to save trip" });
      }

      res.json({
        message: "Trip saved successfully",
        tripId: result.insertId,
      });
    }
  );
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
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const prompt = `
Generate a travel itinerary in STRICT JSON format.

Return ONLY JSON.
NO markdown.
NO explanation.
NO text outside JSON.

Format:
{
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "places": [
        {
          "time": "09:00 AM",
          "placeName": "Place Name",
          "description": "Short description",
          "duration": "2 hours",
          "price": "₹500"
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
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const generatedText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let generatedPlan;

    try {
      let cleanText = generatedText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      generatedPlan = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Parse Error:", parseError);
      console.error("Raw Gemini Output:", generatedText);

      return res.status(500).json({
        message: "Gemini returned invalid JSON",
        raw: generatedText,
      });
    }

    const insertQuery = `
      INSERT INTO trips
      (user_id, boarding, destination, budget, days, travellers, travel_date, return_date, interests, generated_plan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [
        user_id,
        boarding,
        destination,
        budget,
        days,
        travellers,
        travel_date,
        return_date,
        interests,
        JSON.stringify(generatedPlan),
      ],
      (err, result) => {
        if (err) {
          console.error("DB insert error:", err);
          return res.status(500).json({ message: "Failed to save trip" });
        }

        const tripId = result.insertId;

        return res.status(201).json({
          message: "Trip generated successfully",
          tripId,
          trip: {
            id: tripId,
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
          },
        });
      }
    );
  } catch (error) {
    console.error("Generate trip error:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Trip generation failed",
      error: error.response?.data || error.message,
    });
  }
};

exports.getTripById = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM trips WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch trip" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const trip = result[0];

    try {
      trip.generated_plan = JSON.parse(trip.generated_plan);
    } catch {
      trip.generated_plan = null;
    }

    res.json(trip);
  });
};

exports.getLatestTripByDestination = (req, res) => {
  const { destination } = req.params;

  db.query(
    "SELECT * FROM trips WHERE destination = ? ORDER BY id DESC LIMIT 1",
    [destination],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to fetch latest trip" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No trip found" });
      }

      const trip = result[0];

      try {
        trip.generated_plan = JSON.parse(trip.generated_plan);
      } catch {
        trip.generated_plan = null;
      }

      res.json(trip);
    }
  );
};

exports.getTripsByUser = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      id,
      user_id,
      boarding,
      destination,
      budget,
      days,
      travellers,
      travel_date,
      return_date,
      interests,
      generated_plan
    FROM trips
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user trips:", err);
      return res.status(500).json({ message: "Failed to fetch user trips" });
    }

    const trips = result.map((trip) => {
      try {
        trip.generated_plan = JSON.parse(trip.generated_plan);
      } catch {
        trip.generated_plan = null;
      }
      return trip;
    });

    res.json(trips);
  });
};