import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Decisions
export const createDecision = (decisionData) => API.post('/decisions', decisionData)
export const getDecision = (id) => API.get(`/decisions/${id}`)

// Mindset
export const createMindset = (mindsetData) => API.post('/mindset', mindsetData)
export const getMindset = (decisionId) => API.get(`/mindset/${decisionId}`)

// ProsCons
export const addProsCons = (prosConsData) => API.post('/proscons', prosConsData)
export const getProsConsByDecision = (decisionId) => API.get(`/proscons/${decisionId}`)

// Analysis
export const getDecisionAnalysis = (decisionId) => API.get(`/decisions/${decisionId}/analysis`)

// AI Service
export const generateProsCons = async (decisionId, options) => {
  try {
    // In a real app, you would call your backend which then calls the AI API
    const response = await API.post('/ai/generate-pros-cons', {
      decisionId,
      optionA: options.optionA,
      optionB: options.optionB,
    })
    return response.data
  } catch (error) {
    console.error('AI generation error:', error)
    throw error
  }
}