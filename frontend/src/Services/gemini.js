import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing. Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

export const generateTrip = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash-lite-tts",
    contents: prompt,
  });

  return response.text;
};