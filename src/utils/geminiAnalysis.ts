import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

export async function analyzeColumn(data: any[], column: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sampleData = data.slice(0, 100).map(row => row[column]);
  const prompt = `Analyze this column of data named "${column}". Sample values: ${JSON.stringify(sampleData)}
    Please provide:
    1. A brief description of what this column represents
    2. Potential use in machine learning
    3. Recommended preprocessing steps
    Format as JSON with keys: description, mlUse, preprocessing`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

export async function detectVariables(data: any[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const columns = Object.keys(data[0]);
  const sampleData = data.slice(0, 10);
  
  const prompt = `Analyze these columns in a dataset: ${JSON.stringify(columns)}
    Sample data: ${JSON.stringify(sampleData)}
    Identify:
    1. Which columns are likely dependent variables (targets)
    2. Which columns are independent variables (features)
    3. Which columns should be removed
    Format as JSON with keys: dependent, independent, remove`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
} 