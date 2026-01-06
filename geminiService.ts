
export const generateProductDescription = async (productName: string, category: string) => {
  try {
    const res = await fetch('/api/ai/description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, category })
    });
    const data = await res.json();
    return data.text || "Experience the peak of luxury with our curated selection.";
  } catch (error) {
    console.error("Gemini Backend Error:", error);
    return "Experience the peak of luxury with our curated selection.";
  }
};

export const analyzeSalesTrends = async (ordersJson: string) => {
  // This logic should also ideally move to the backend if complex
  return ["Maintain high inventory for seasonal trends", "Focus on premium floral arrangements", "Enhance customer loyalty programs"];
};
