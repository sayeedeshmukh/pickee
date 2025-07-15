const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); 

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  // throwing an error or handling this more robustly in production
}

// Initialize 
const genAI = new GoogleGenerativeAI(API_KEY);

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Function to generate pros and cons for two options
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
    - Format as valid JSON exactly like this:
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


    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Gemini might wrap JSON in markdown, so we need to extract it
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();

    const parsedResult = JSON.parse(jsonString);

    if (!parsedResult.optionA || !parsedResult.optionB) {
      throw new Error("Invalid AI response format from Gemini");
    }

    return parsedResult;
  } catch (error) {
    console.error('Gemini generateProsCons error:', error);
    return {
      optionA: {
        pros: [
          "Benefit for Option A (AI failed to generate)",
          "Another benefit for Option A (AI failed to generate)",
          "A third benefit for Option A (AI failed to generate)"
        ],
        cons: [
          "Drawback for Option A (AI failed to generate)",
          "Another drawback for Option A (AI failed to generate)",
          "A third drawback for Option A (AI failed to generate)"
        ]
      },
      optionB: {
        pros: [
          "Benefit for Option B (AI failed to generate)",
          "Another benefit for Option B (AI failed to generate)",
          "A third benefit for Option B (AI failed to generate)"
        ],
        cons: [
          "Drawback for Option B (AI failed to generate)",
          "Another drawback for Option B (AI failed to generate)",
          "A third drawback for Option B (AI failed to generate)"
        ]
      }
    };
  }
}

// Function to generate the efficient choice based on pros, cons, and user ratings
async function generateEfficientChoice(decision, prosCons, mindset) {
  try {
    let proConDetails = '';
    const optionAPros = prosCons.filter(item => item.option === 'A' && item.type === 'pro');
    const optionACons = prosCons.filter(item => item.option === 'A' && item.type === 'con');
    const optionBPros = prosCons.filter(item => item.option === 'B' && item.type === 'pro');
    const optionBCons = prosCons.filter(item => item.option === 'B' && item.type === 'con');

    proConDetails += `Option A: ${decision.optionA.title}\n`;
    proConDetails += '  Pros:\n';
    optionAPros.forEach(p => proConDetails += `    - ${p.text} (Importance: ${p.rating}/5)\n`);
    proConDetails += '  Cons:\n';
    optionACons.forEach(c => proConDetails += `    - ${c.text} (Importance: ${c.rating}/5)\n`);

    proConDetails += `\nOption B: ${decision.optionB.title}\n`;
    proConDetails += '  Pros:\n';
    optionBPros.forEach(p => proConDetails += `    - ${p.text} (Importance: ${p.rating}/5)\n`);
    proConDetails += '  Cons:\n';
    optionBCons.forEach(c => proConDetails += `    - ${c.text} (Importance: ${c.rating}/5)\n`);

    const mindsetDetails = mindset ?
      `\nUser's Mindset:
      - Clarity Level: ${mindset.clarityLevel}
      - Fear of Regret: ${mindset.fearOfRegret}
      - Emotional Attachment: ${mindset.emotionalAttachment}
      - Practical Approach: ${mindset.practicalApproach}
      - Notes: ${mindset.notes || 'None'}`
      : '';

    const prompt = `You are a highly intelligent and unbiased decision-making AI.
    Analyze the following two options, their pros and cons, and the user's importance ratings (1-5, where 5 is most important).
    Also consider the user's mindset assessment to provide a holistic recommendation.

    ${proConDetails}
    ${mindsetDetails}

    Based on all the provided information, including the importance ratings and the user's mindset, determine which option is the most efficient and logical choice for the user.
    Provide a comprehensive analysis including:
    1. A clear recommendation for either Option A or Option B, or state if it's a balanced choice.
    2. A detailed summary explaining your recommendation, highlighting how the user's ratings and mindset influenced it.
    3. Key strengths of the recommended option based on the user's priorities.
    4. Key considerations or potential challenges for the recommended option.

    Format your output as a valid JSON object like this:
    {
      "recommendedOption": "A" | "B" | "Balanced",
      "summary": "Your detailed explanation and reasoning here...",
      "strengths": ["list of strengths based on user priorities"],
      "considerations": ["list of potential challenges or points to consider"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonString = text.replace(/```json\n|\n```/g, '').trim();
    const parsedResult = JSON.parse(jsonString);

    if (!parsedResult.recommendedOption || !parsedResult.summary) {
      throw new Error("Invalid AI analysis response format from Gemini");
    }

    return parsedResult;
  } catch (error) {
    console.error('Gemini generateEfficientChoice error:', error);
    return {
      recommendedOption: "Undetermined",
      summary: "AI analysis failed to generate. Please try again or provide more input.",
      strengths: [],
      considerations: []
    };
  }
}

module.exports = {
  generateProsCons,
  generateEfficientChoice, 
};