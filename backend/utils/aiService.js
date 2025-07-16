const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  throw new Error("GEMINI_API_KEY is missing. Please set it in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractJsonFromString(text) {
  const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1].trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch && jsonMatch[0]) {
    return jsonMatch[0].trim();
  }
  return null;
}

async function generateProsCons(optionA, optionB) {
  try {
    const prompt = `Act as a professional decision-making assistant. Compare these two options and generate 3 high-quality pros and 3 high-quality cons for each:
    Option A: ${optionA}
    Option B: ${optionB}
    
    Requirements:
    - Be specific and concrete
    - Avoid generic statements
    - Consider both short-term and long-term impacts
    - Include potential risks and opportunities
    - Format as valid JSON exactly like this (ensure all keys are present, even if arrays are empty):
    {
      "optionA": { 
        "pros": ["specific pro 1", "specific pro 2", "specific pro 3"],
        "cons": ["specific con 1", "specific con 2", "specific con 3"] 
      },
      "optionB": {
        "pros": ["specific pro 1", "specific pro 2", "specific pro 3"],
        "cons": ["specific con 1", "specific con 2", "specific con 3"]
      }
    }`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    });
    
    const response = await result.response;
    const rawText = response.text();

    const jsonString = extractJsonFromString(rawText);
    if (!jsonString) {
      throw new Error("Could not extract valid JSON from Gemini response.");
    }

    const parsedResult = JSON.parse(jsonString);
    
    if (!parsedResult.optionA || !Array.isArray(parsedResult.optionA.pros) || !Array.isArray(parsedResult.optionA.cons) ||
        !parsedResult.optionB || !Array.isArray(parsedResult.optionB.pros) || !Array.isArray(parsedResult.optionB.cons)) {
      throw new Error("Invalid AI response format: missing expected properties or arrays.");
    }
    
    return parsedResult;
  } catch (error) {
    console.error('Gemini generateProsCons error:', error);
    return {
      optionA: {
        pros: [
          "AI could not generate specific pros for Option A.",
          "Consider its benefits related to your goals."
        ],
        cons: [
          "AI could not generate specific cons for Option A.",
          "Think about potential drawbacks."
        ]
      },
      optionB: {
        pros: [
          "AI could not generate specific pros for Option B.",
          "Consider its benefits related to your goals."
        ],
        cons: [
          "AI could not generate specific cons for Option B.",
          "Think about potential drawbacks."
        ]
      }
    };
  }
}

// Renamed getGeminiSummary to generateEfficientChoice for consistency
async function generateEfficientChoice(decisionData, prosConsData, mindsetData) {
  try {
    const prompt = `Given the following decision and its pros/cons, provide an objective analysis focusing on strengths of the recommended option and overall considerations.
    
    Decision:
    Option A: ${decisionData.optionA.title}
    Pros for Option A: ${prosConsData.filter(pc => pc.option === 'A' && pc.type === 'pro').map(pc => pc.text).join(', ') || 'None'}
    Cons for Option A: ${prosConsData.filter(pc => pc.option === 'A' && pc.type === 'con').map(pc => pc.text).join(', ') || 'None'}

    Option B: ${decisionData.optionB.title}
    Pros for Option B: ${prosConsData.filter(pc => pc.option === 'B' && pc.type === 'pro').map(pc => pc.text).join(', ') || 'None'}
    Cons for Option B: ${prosConsData.filter(pc => pc.option === 'B' && pc.type === 'con').map(pc => pc.text).join(', ') || 'None'}

    ${mindsetData ? `Mindset considerations: ${mindsetData.description}` : ''}

    Based on these, recommend one option and provide a concise summary, listing key strengths of the recommended option and overall considerations.
    Format as valid JSON exactly like this:
    {
      "recommendedOption": "Option A Title" or "Option B Title",
      "summary": "A concise summary of the analysis.",
      "strengths": ["Strength 1", "Strength 2"],
      "considerations": ["Consideration 1", "Consideration 2"]
    }`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.5,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    });

    const response = await result.response;
    const rawText = response.text();

    const jsonString = extractJsonFromString(rawText);
    if (!jsonString) {
      throw new Error("Could not extract valid JSON from Gemini summary response.");
    }
    const parsedResult = JSON.parse(jsonString);

    if (!parsedResult.recommendedOption || !parsedResult.summary || !Array.isArray(parsedResult.strengths) || !Array.isArray(parsedResult.considerations)) {
      throw new Error("Invalid Gemini summary response format.");
    }

    return parsedResult;

  } catch (error) {
    console.error('Gemini generateEfficientChoice error:', error);
    return {
      recommendedOption: "No recommendation available",
      summary: "AI analysis could not be generated at this time.",
      strengths: ["N/A"],
      considerations: ["N/A"]
    };
  }
}

module.exports = { generateProsCons, generateEfficientChoice };