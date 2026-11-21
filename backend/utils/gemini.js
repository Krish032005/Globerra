// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

// const wait = (ms) =>
//   new Promise((resolve) => setTimeout(resolve, ms));

// export const generateTripPlan = async ({
//   boarding,
//   destination,
//   days,
//   budget,
//   travellers,
//   travel_date,
//   return_date,
//   interests,
// }) => {
//   const prompt = `
// You are an expert travel planner.

// Create a personalized travel itinerary using these details:

// Boarding: ${boarding}
// Destination: ${destination}
// Duration: ${days} days
// Budget: ${budget}
// Travellers: ${travellers}
// Travel Date: ${travel_date}
// Return Date: ${return_date}
// Interests: ${interests}

// Return a valid JSON object in this exact structure:

// {
//   "tripSummary": {
//     "boarding": "${boarding}",
//     "destination": "${destination}",
//     "duration": "${days} days",
//     "budget": "${budget}",
//     "travellers": "${travellers}"
//   },
//   "days": [
//     {
//       "day": 1,
//       "title": "Arrival and Local Sightseeing",
//       "places": [
//         {
//           "time": "09:00 AM",
//           "placeName": "Place Name",
//           "description": "Short description",
//           "duration": "2 hours",
//           "price": "₹500"
//         }
//       ]
//     }
//   ],
//   "estimatedTotal": "₹10000",
//   "travelTips": [
//     "Tip 1",
//     "Tip 2"
//   ]
// }

// Rules:
// - Generate exactly ${days} days.
// - Suggest realistic places.
// - Consider the budget and interests.
// - Keep descriptions short.
// - Return JSON only.
// - Do not include Markdown or explanations.
// `;

//   let lastError;

//   for (let attempt = 1; attempt <= 3; attempt++) {
//     try {
//       const response = await ai.models.generateContent({
//         model: MODEL,
//         contents: prompt,
//         config: {
//           responseMimeType: "application/json",
//           temperature: 0.7,
//         },
//       });

//       const responseText = response.text;

//       if (!responseText) {
//         throw new Error("Gemini returned an empty response");
//       }

//       const trip = JSON.parse(responseText);

//       if (!trip.days || !Array.isArray(trip.days)) {
//         throw new Error("Invalid itinerary structure returned by Gemini");
//       }

//       return trip;

//     } catch (error) {
//       lastError = error;

//       console.error(`Gemini attempt ${attempt}:`, error.message);

//       const status = Number(error.status);

//       const isTemporary =
//         status === 429 ||
//         status === 500 ||
//         status === 503 ||
//         error.status === "UNAVAILABLE" ||
//         error.status === "RESOURCE_EXHAUSTED";

//       if (!isTemporary || attempt === 3) {
//         break;
//       }

//       await wait(attempt * 2000);
//     }
//   }

//   throw lastError;
// };



import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Ignore empty or "undefined" values coming from .env or the deployment dashboard
const envModel = process.env.GEMINI_MODEL?.trim();
const MODEL =
  envModel && envModel !== "undefined" && envModel !== "null"
    ? envModel
    : "gemini-3.5-flash";

console.log("Gemini model in use:", MODEL);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Removes ```json fences in case the model adds them despite the instructions
const cleanJson = (text) =>
  text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

export const generateTripPlan = async ({
  boarding,
  destination,
  days,
  budget,
  travellers,
  travel_date,
  return_date,
  interests,
}) => {
  const prompt = `
You are an expert travel planner.

Create a personalized travel itinerary using these details:

Boarding: ${boarding}
Destination: ${destination}
Duration: ${days} days
Budget: ${budget}
Travellers: ${travellers}
Travel Date: ${travel_date}
Return Date: ${return_date}
Interests: ${interests}

Return a valid JSON object in this exact structure:

{
  "tripSummary": {
    "boarding": "${boarding}",
    "destination": "${destination}",
    "duration": "${days} days",
    "budget": "${budget}",
    "travellers": "${travellers}"
  },
  "days": [
    {
      "day": 1,
      "title": "Arrival and Local Sightseeing",
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
  ],
  "estimatedTotal": "₹10000",
  "travelTips": [
    "Tip 1",
    "Tip 2"
  ]
}

Rules:
- Generate exactly ${days} days.
- Suggest realistic places.
- Consider the budget and interests.
- Keep descriptions short.
- Return JSON only.
- Do not include Markdown or explanations.
`;

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text;

      if (!responseText) {
        throw new Error("Gemini returned an empty response");
      }

      const trip = JSON.parse(cleanJson(responseText));

      if (!trip.days || !Array.isArray(trip.days)) {
        throw new Error("Invalid itinerary structure returned by Gemini");
      }

      return trip;
    } catch (error) {
      lastError = error;

      console.error(`Gemini attempt ${attempt} (model: ${MODEL}):`, error.message);

      const status = Number(error.status);

      const isTemporary =
        status === 429 ||
        status === 500 ||
        status === 503 ||
        error.status === "UNAVAILABLE" ||
        error.status === "RESOURCE_EXHAUSTED";

      if (!isTemporary || attempt === 3) {
        break;
      }

      await wait(attempt * 2000);
    }
  }

  throw lastError;
};