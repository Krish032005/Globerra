import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateTripPlan = async ({ destination, days, budget, travellers }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Create a travel itinerary in strict JSON format only.

User Trip Details:
- Boarding: ${boarding}
- Destination: ${destination}
- Budget: ${budget}
- Days: ${days}
- Travellers: ${travellers}
- Travel Date: ${travel_date}
- Return Date: ${return_date}
- Interests: ${interests}

Return ONLY valid JSON in this exact format:
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
  "estimatedTotal": "₹0",
  "travelTips": [
    "Tip 1",
    "Tip 2"
  ]
}

Rules:
- Do not return paragraph
- Do not return markdown
- Do not return explanation
- Do not use code block
- Return valid JSON only
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(
    text.replace(/```json/g, "").replace(/```/g, "").trim()
  );
};