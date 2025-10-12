const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


const API_KEY = process.env.GEMINI_API_KEY;

console.log("Gemini API Key loaded:", API_KEY ? "✅ Yes" : "❌ No");

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  throw new Error("GEMINI_API_KEY is missing. Please set it in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

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
    const prompt = `Imagine you're helping a close friend talk through a decision. Compare these two options and generate 3 pros and 3 cons for each, but keep it super casual, friendly, and real—like you're chatting over coffee. Use a conversational, lively tone. Avoid sounding like a robot or a formal report. Make each point feel personal, relatable, and easy to read.

Option A: ${optionA}
Option B: ${optionB}

Requirements:
- Be specific and concrete
- Avoid generic statements
- Use casual, friendly, and even playful language
- Make it sound like real advice from a friend
- Format as valid JSON exactly like this (ensure all keys are present, even if arrays are empty):
{
  "optionA": { 
    "pros": ["casual pro 1", "casual pro 2", "casual pro 3"],
    "cons": ["casual con 1", "casual con 2", "casual con 3"] 
  },
  "optionB": {
    "pros": ["casual pro 1", "casual pro 2", "casual pro 3"],
    "cons": ["casual con 1", "casual con 2", "casual con 3"]
  }
}`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9,
        topK: 40,
        topP: 0.98,
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
          "AI couldn't come up with casual pros for Option A. Try thinking about what makes it fun or easy!",
          "Consider what feels right for you."
        ],
        cons: [
          "AI couldn't come up with casual cons for Option A. Maybe chat with a friend for more ideas!",
          "Think about what might bug you."
        ]
      },
      optionB: {
        pros: [
          "AI couldn't come up with casual pros for Option B. Try thinking about what makes it fun or easy!",
          "Consider what feels right for you."
        ],
        cons: [
          "AI couldn't come up with casual cons for Option B. Maybe chat with a friend for more ideas!",
          "Think about what might bug you."
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