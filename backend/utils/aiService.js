const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const { computeWeightedScores } = require('./scoring');
const { formatMindsetForPrompt } = require('./formatMindset');
require('dotenv').config();


const API_KEY = process.env.GEMINI_API_KEY;

console.log("Gemini API Key loaded:", API_KEY ? "Yes" : "No");

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables.");
  throw new Error("GEMINI_API_KEY is missing. Please set it in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
// Default to a model id that exists on the current v1beta API.
// You can override via GEMINI_MODEL (e.g. "gemini-2.5-flash").
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const model = genAI.getGenerativeModel({ model: modelName });

/** Forces valid JSON shape from Gemini (avoids truncated / invalid JSON strings). */
const prosConsResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    optionA: {
      type: SchemaType.OBJECT,
      properties: {
        pros: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          minItems: 3,
          maxItems: 3,
        },
        cons: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          minItems: 3,
          maxItems: 3,
        },
      },
      required: ['pros', 'cons'],
    },
    optionB: {
      type: SchemaType.OBJECT,
      properties: {
        pros: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          minItems: 3,
          maxItems: 3,
        },
        cons: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          minItems: 3,
          maxItems: 3,
        },
      },
      required: ['pros', 'cons'],
    },
  },
  required: ['optionA', 'optionB'],
};

const decisionAnalysisResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    recommendedOption: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    strengths: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      minItems: 2,
      maxItems: 4,
    },
    considerations: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      minItems: 2,
      maxItems: 4,
    },
  },
  required: ['recommendedOption', 'summary', 'strengths', 'considerations'],
};

function parseGeminiJson(rawText) {
  const jsonString = extractJsonFromString(rawText);
  if (!jsonString) {
    const preview = (rawText || '').slice(0, 800);
    throw new Error(`Could not extract valid JSON from Gemini response. Preview: ${preview}`);
  }
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    const repaired = escapeNewlinesInsideJsonStrings(balanceCurlyBraces(jsonString));
    return JSON.parse(repaired);
  }
}

function extractJsonFromString(text) {
  const trimmed = (text || '').trim();
  // If the model returned pure JSON (common with responseMimeType), use it directly.
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }
  const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1].trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch && jsonMatch[0]) {
    return jsonMatch[0].trim();
  }
  // Last resort: if it *looks* like JSON but is truncated, try returning the trimmed text
  // and let the downstream repair logic attempt to balance braces/newlines.
  if (trimmed.startsWith('{')) {
    return trimmed;
  }
  return null;
}

function escapeNewlinesInsideJsonStrings(jsonLike) {
  // Gemini occasionally returns JSON-like text with literal newlines inside quoted strings.
  // This makes it invalid JSON. We repair by escaping CR/LF/TAB while inside quotes.
  let out = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < jsonLike.length; i++) {
    const ch = jsonLike[i];

    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      out += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      out += ch;
      inString = !inString;
      continue;
    }

    if (inString) {
      if (ch === '\n') {
        out += '\\n';
        continue;
      }
      if (ch === '\r') {
        out += '\\r';
        continue;
      }
      if (ch === '\t') {
        out += '\\t';
        continue;
      }
    }

    out += ch;
  }

  return out;
}

function balanceCurlyBraces(jsonLike) {
  const open = (jsonLike.match(/\{/g) || []).length;
  const close = (jsonLike.match(/\}/g) || []).length;
  if (close >= open) return jsonLike;
  return jsonLike + '}'.repeat(open - close);
}

async function generateProsCons(optionA, optionB) {
  try {
    const prompt = `You are a thoughtful friend helping someone make a real-life choice — not a corporate analyst. Generate exactly 3 pros and 3 cons for EACH option. Every item must compare the two options (relative), and should feel emotionally honest, not generic.

Option A: "${optionA}"
Option B: "${optionB}"

Lists:
- optionA.pros = ways A is better than B (include practical AND emotional upsides)
- optionA.cons = real trade-offs or worries if they pick A over B (not catastrophizing)
- optionB.pros / optionB.cons = same for B vs A

Return ONLY valid JSON (no markdown).
Each item:
- single line, max 100 characters, no newlines
- must compare (use "than", "vs", "compared to", or name the other option)
- specific to THESE options — no filler like "good opportunity" or "might regret it"
- capture nuance: identity, relationships, stress, pride, peace of mind where relevant
- BAD: "Lower rent", "Nice place", "Could be better"
- GOOD: "Rent leaves more room to save than ${optionB}", "You'd miss your people near ${optionB} if you pick A"

Do NOT repeat the same idea as both a pro and a con. Do NOT copy the same sentence across A and B.
Format as valid JSON exactly like this:
{
  "optionA": { 
    "pros": ["comparative pro vs B 1", "comparative pro vs B 2", "comparative pro vs B 3"],
    "cons": ["comparative con vs B 1", "comparative con vs B 2", "comparative con vs B 3"] 
  },
  "optionB": {
    "pros": ["comparative pro vs A 1", "comparative pro vs A 2", "comparative pro vs A 3"],
    "cons": ["comparative con vs A 1", "comparative con vs A 2", "comparative con vs A 3"]
  }
}`;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: prosConsResponseSchema,
        temperature: 0.45,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1400,
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

    const parsedResult = parseGeminiJson(rawText);
    
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
          `Think how "${optionA}" beats "${optionB}" — e.g. lower cost than ${optionB}`,
          `What would you gain by picking ${optionA} over ${optionB}?`,
          `Add a pro that only makes sense vs ${optionB}`,
        ],
        cons: [
          `What does ${optionA} lose compared to ${optionB}?`,
          `Trade-off of ${optionA} vs staying with ${optionB}`,
          `Add a con that references ${optionB}`,
        ],
      },
      optionB: {
        pros: [
          `Think how "${optionB}" beats "${optionA}" — e.g. stability vs ${optionA}`,
          `What would you gain by picking ${optionB} over ${optionA}?`,
          `Add a pro that only makes sense vs ${optionA}`,
        ],
        cons: [
          `What does ${optionB} lose compared to ${optionA}?`,
          `Trade-off of ${optionB} vs choosing ${optionA}`,
          `Add a con that references ${optionA}`,
        ],
      },
    };
  }
}

function computeOptionScores(prosConsData) {
  const { scoreA, scoreB } = computeWeightedScores(prosConsData);
  return { scoreA, scoreB };
}

function resolveWinnerFromScores(scoreA, scoreB, titleA, titleB) {
  if (scoreA > scoreB) return { winner: titleA, loser: titleB, isTie: false };
  if (scoreB > scoreA) return { winner: titleB, loser: titleA, isTie: false };
  return { winner: null, loser: null, isTie: true };
}

function formatProsConsForPrompt(prosConsData, option, type, otherTitle) {
  const label = type === 'pro' ? 'Pros' : 'Cons';
  const items = prosConsData
    .filter((pc) => pc.option === option && pc.type === type)
    .map((pc) => `${pc.text} (importance ${pc.rating})`);
  if (items.length === 0) return `${label} vs "${otherTitle}": None`;
  return `${label} vs "${otherTitle}": ${items.join('; ')}`;
}

function finalizeDecisionAnalysis(parsed, { titleA, titleB, scoreA, scoreB, winner, isTie }) {
  const recommendedOption = isTie
    ? `Tie between "${titleA}" and "${titleB}"`
    : winner;

  const result = {
    ...parsed,
    recommendedOption,
    scores: { optionA: scoreA, optionB: scoreB },
    isTie,
    reasons: Array.isArray(parsed.strengths) ? parsed.strengths : [],
  };

  return result;
}

function buildScoreBasedFallback({ titleA, titleB, scoreA, scoreB, prosConsData, isTie, winner, loser }) {
  if (isTie) {
    return {
      recommendedOption: `Tie between "${titleA}" and "${titleB}"`,
      summary: `Your importance ratings total ${scoreA} for "${titleA}" and ${scoreB} for "${titleB}" — a tie. Revisit which comparative factors matter most, or adjust ratings if something feels off.`,
      strengths: [
        `"${titleA}" has meaningful advantages in your list`,
        `"${titleB}" also scores well on what matters to you`,
      ],
      considerations: [
        'Both options are equally weighted by your ratings',
        'Focus on the highest-rated individual points on each side',
      ],
      scores: { optionA: scoreA, optionB: scoreB },
      isTie: true,
      reasons: [
        `"${titleA}" has meaningful advantages in your list`,
        `"${titleB}" also scores well on what matters to you`,
      ],
    };
  }

  const winnerOption = winner === titleA ? 'A' : 'B';
  const topPros = prosConsData
    .filter((pc) => pc.option === winnerOption && pc.type === 'pro')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 2)
    .map((pc) => pc.text);

  return {
    recommendedOption: winner,
    summary: `Based on your importance ratings, "${winner}" scores higher (${winner === titleA ? scoreA : scoreB} vs ${loser === titleA ? scoreA : scoreB} for "${loser}"). Your comparative pros and cons favor this choice overall.`,
    strengths: topPros.length > 0
      ? topPros
      : [`"${winner}" aligns better with your rated priorities than "${loser}"`],
    considerations: prosConsData
      .filter((pc) => pc.option === winnerOption && pc.type === 'con')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 2)
      .map((pc) => pc.text)
      .concat([`Trade-offs vs "${loser}" still matter — review cons before deciding`])
      .slice(0, 3),
    scores: { optionA: scoreA, optionB: scoreB },
    isTie: false,
    reasons: topPros.length > 0
      ? topPros
      : [`"${winner}" aligns better with your rated priorities than "${loser}"`],
  };
}

// Renamed getGeminiSummary to generateEfficientChoice for consistency
async function generateEfficientChoice(decisionData, prosConsData, mindsetData) {
  const titleA = decisionData.optionA.title;
  const titleB = decisionData.optionB.title;
  const { scoreA, scoreB } = computeOptionScores(prosConsData);
  const { winner, loser, isTie } = resolveWinnerFromScores(scoreA, scoreB, titleA, titleB);

  const mindsetBlock = formatMindsetForPrompt(mindsetData);

  const scoreInstruction = isTie
    ? `SCORES (authoritative, linear: each star = 1 point, pros add / cons subtract): "${titleA}" = ${scoreA}, "${titleB}" = ${scoreB} — TIED. Explain the tie with empathy; do not declare a single winner.`
    : `SCORES (authoritative, linear: each star = 1 point, pros add / cons subtract): "${titleA}" = ${scoreA}, "${titleB}" = ${scoreB}. Winner by net points: "${winner}". recommendedOption must be exactly "${winner}".`;

  try {
    const prompt = `You are ORICA — a warm, emotionally intelligent decision guide. Help someone understand their choice between two options. Never sound like a corporate report or give fake certainty.

${scoreInstruction}

Option A: "${titleA}"
Option B: "${titleB}"

${formatProsConsForPrompt(prosConsData, 'A', 'pro', titleB)}
${formatProsConsForPrompt(prosConsData, 'A', 'con', titleB)}
${formatProsConsForPrompt(prosConsData, 'B', 'pro', titleA)}
${formatProsConsForPrompt(prosConsData, 'B', 'con', titleA)}
${mindsetBlock ? `\nHow they feel about this decision:\n${mindsetBlock}\n` : ''}

Return ONLY valid JSON.
summary: 3–5 sentences. Explain WHY the recommended option fits (or why it's tied). Name emotional conflict if mindset suggests it. Mention tradeoffs honestly. Use "might", "could", "leans toward" — not "definitely" or "the only right choice".
${isTie
    ? `recommendedOption must acknowledge the tie between "${titleA}" and "${titleB}".`
    : `recommendedOption must be exactly "${winner}".`}
strengths = 2–4 comparative advantages for the recommended side (not generic praise).
considerations = 2–4 honest trade-offs/risks for the recommended side (what they might grieve or worry about).
Do NOT swap pros into considerations. Each item: one line, max 120 characters.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: decisionAnalysisResponseSchema,
        temperature: 0.45,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1400,
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
    const parsedResult = parseGeminiJson(rawText);

    if (!parsedResult.summary || !Array.isArray(parsedResult.strengths) || !Array.isArray(parsedResult.considerations)) {
      throw new Error("Invalid Gemini summary response format.");
    }

    return finalizeDecisionAnalysis(parsedResult, { titleA, titleB, scoreA, scoreB, winner, isTie });

  } catch (error) {
    console.error('Gemini generateEfficientChoice error:', error);
    return buildScoreBasedFallback({
      titleA,
      titleB,
      scoreA,
      scoreB,
      prosConsData,
      isTie,
      winner,
      loser,
    });
  }
}

module.exports = { generateProsCons, generateEfficientChoice };