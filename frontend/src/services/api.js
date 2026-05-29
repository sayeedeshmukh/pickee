import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Decisions
export const createDecision = (decisionData, token) => {
  if (token) {
    return API.post('/decisions', decisionData, { headers: { Authorization: `Bearer ${token}` } });
  }
  return API.post('/decisions', decisionData);
};
export const getDecision = (id) => API.get(`/decisions/${id}`);

// ProsCons
export const addProsCons = (prosConsData) => API.post('/proscons', prosConsData);
export const getProsConsByDecision = (decisionId) => API.get(`/proscons/${decisionId}`);
export const updateProsCons = (id, updateData) => API.put(`/proscons/${id}`, updateData);
export const deleteProsCons = (id) => API.delete(`/proscons/${id}`);

// Analysis (Existing, but check its implementation in your backend analysisController.js)
export const getDecisionAnalysis = (decisionId, { userPreference, includeMindset } = {}) => {
  const params = new URLSearchParams();
  if (userPreference) params.set('userPreference', userPreference);
  if (includeMindset) params.set('includeMindset', 'true');
  const qs = params.toString();
  return API.get(`/decisions/${decisionId}/analysis${qs ? `?${qs}` : ''}`);
};

// --- Gemini API Integrations ---

// Updated function to send a request to your backend for Gemini-generated pros/cons
export const generateProsConsGemini = async ({ optionA, optionB, decisionId }) => {
  const res = await API.post('/ai/generate-pros-cons-gemini', { optionA, optionB, decisionId });
  return res.data;
};

// New function to get the AI-generated decision analysis/summary from Gemini
export const getGeminiSummary = async (decisionId) => {
  const res = await API.get(`/ai/decision-analysis-gemini/${decisionId}`);
  return res.data;
};

// Still Not Sure (mindset follow-up on Results page)
export const submitStillNotSure = (decisionId, formData) =>
  API.post(`/decisions/${decisionId}/still-not-sure`, formData);

export const getStillNotSure = (decisionId) =>
  API.get(`/decisions/${decisionId}/still-not-sure`);

// Mindset reflection (between rating and results)
export const submitMindset = (decisionId, formData) =>
  API.post(`/decisions/${decisionId}/mindset`, formData);

export const getMindset = (decisionId) =>
  API.get(`/decisions/${decisionId}/mindset`);

// Fetch user decision history
export const getUserDecisionHistory = (token) => {
  return API.get('/decisions/user/history', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export async function registerUser(data) {
  return await API.post('/auth/register', data);
}

export async function loginUser(data) {
  return await API.post('/auth/login', data);
}

// Google One Tap / GIS provides an `id_token` (JWT). We verify it server-side.
export async function googleLogin(idToken) {
  const res = await API.post('/auth/google-login', { id_token: idToken });
  return res.data;
}

export async function logoutUser() {
  return await API.post('/auth/logout');
}
