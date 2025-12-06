import { GoogleGenAI } from "@google/genai";
import { CalculatorInputs, SimulationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIRecommendation = async (
  inputs: CalculatorInputs,
  results: SimulationResult
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Gemini API Key is missing. Please configure the environment variable to receive AI insights.";
  }

  const prompt = `
    Act as a professional rainwater harvesting engineer. Analyze the following system data and provide a concise, strategic recommendation (max 150 words).
    
    Site Configuration:
    - Location: ${inputs.city || "Unknown"}
    - Roof Area: ${inputs.roofArea} m²
    - Annual Rainfall: ${inputs.rainfall} mm
    - Demand: ${inputs.annualDemand} m³/year
    - System Cost: $${results.initialInvestment}
    
    Performance Metrics:
    - Potential Capture: ${results.annualCapture.toFixed(1)} m³/year
    - Actual Water Saved: ${results.waterSaved.toFixed(1)} m³/year
    - Payback Period: ${results.paybackPeriod ? results.paybackPeriod + " years" : "Not recovered within lifespan"}
    - ROI: ${results.roi.toFixed(1)}%
    
    Please provide:
    1. A verdict on the system's sizing (is the roof/tank undersized or oversized for the demand?).
    2. A recommendation for tank capacity (liters) considering safety factors.
    3. A brief financial assessment.

    Format with clear headings or bullet points. Use markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI recommendation at this time. Please try again later.";
  }
};