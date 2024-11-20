import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

export async function analyzeVariables(data: any[], columns: string[]) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this dataset with columns: ${columns.join(', ')}
    Sample data: ${JSON.stringify(data.slice(0, 5))}
    
    Identify:
    1. Which columns are likely dependent variables (target/y)?
    2. Which columns are likely independent variables (features/X)?
    
    Return JSON format:
    {
      "dependent": ["col1"],
      "independent": ["col2", "col3"]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
} 