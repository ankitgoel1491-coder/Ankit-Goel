import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, FileData } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeFinancials(files: FileData[]): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const fileParts = files.map(file => ({
    inlineData: {
      data: file.base64.split(',')[1],
      mimeType: file.type
    }
  }));

  const prompt = `
    You are a world-class Senior Equity Research Analyst. 
    Analyze the attached financial documents and provide a comprehensive investment analysis.
    
    Your analysis should include:
    1. A clear investment recommendation (Strong Buy to Strong Sell).
    2. Key financial ratios (Liquidity, Profitability, Solvency, Efficiency).
    3. Qualitative analysis of strengths and weaknesses.
    4. Valuation analysis and growth prospects.
    5. Risk assessment.
    6. Historical performance data for charting (if available, otherwise estimate based on trends in the documents).

    Return the result strictly in JSON format matching the following schema:
    {
      "companyName": "string",
      "recommendation": "Strong Buy | Buy | Hold | Sell | Strong Sell",
      "summary": "markdown string",
      "ratios": [
        {
          "name": "string",
          "value": number,
          "benchmark": number,
          "interpretation": "string",
          "category": "Liquidity | Profitability | Solvency | Efficiency"
        }
      ],
      "strengths": ["string"],
      "weaknesses": ["string"],
      "valuationAnalysis": "markdown string",
      "growthProspects": "markdown string",
      "riskAssessment": "markdown string",
      "chartData": [
        {
          "year": "string",
          "revenue": number,
          "netIncome": number,
          "operatingMargin": number
        }
      ]
    }
  `;

  const response = await genAI.models.generateContent({
    model,
    contents: [{ parts: [...fileParts, { text: prompt }] }],
    config: {
      responseMimeType: "application/json",
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as AnalysisResult;
}
