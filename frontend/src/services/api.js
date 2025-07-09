import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Decisions
export const createDecision = (decisionData) => API.post('/decisions', decisionData);
export const getDecision = (id) => API.get(`/decisions/${id}`);

// Mindset
export const createMindset = (mindsetData) => API.post('/mindset', mindsetData);
export const getMindset = (decisionId) => API.get(`/mindset/${decisionId}`);

// ProsCons
export const addProsCons = (prosConsData) => API.post('/proscons', prosConsData);
export const getProsConsByDecision = (decisionId) => API.get(`/proscons/${decisionId}`);

// Analysis
export const getDecisionAnalysis = (decisionId) => API.get(`/decisions/${decisionId}/analysis`);


// Send a request to your OpenRouter backend to generate pros/cons
export const generateProsConsOR = async ({ optionA, optionB }) => {
  const res = await fetch('/api/ai/generate-pros-cons-openrouter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ optionA, optionB }),
  });

  if (!res.ok) throw new Error('OpenRouter pros/cons generation failed');
  return res.json();
};

