
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a luxury marketing description for a gift called "${productName}" in the "${category}" category. Make it sound premium, elegant, and emotive. Max 100 words.`,
    });
    return response.text || "Experience the peak of luxury with our curated selection.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Experience the peak of luxury with our curated selection.";
  }
};

export const analyzeSalesTrends = async (ordersJson: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this order history and provide 3 key business insights for the owner: ${ordersJson}`,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
          }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return ["Maintain high inventory for seasonal trends", "Focus on premium floral arrangements", "Enhance customer loyalty programs"];
  }
};
