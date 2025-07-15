const { generateProsCons, generateEfficientChoice } = require('../utils/aiService');
const Decision = require('../models/Decision'); 
const ProsCons = require('../models/ProsCons'); 
const Mindset = require('../models/Mindset'); 

// This controller will handle the request for generating initial pros/cons
const getGeminiProsCons = async (req, res) => {
  const { optionA, optionB } = req.body;

  if (!optionA || !optionB) {
    return res.status(400).json({ error: 'Option A and Option B are required.' });
  }

  try {
    const suggestions = await generateProsCons(optionA, optionB);
    res.json(suggestions);
  } catch (error) {
    console.error('Error in getGeminiProsCons controller:', error);
    res.status(500).json({ error: 'Failed to generate pros and cons from Gemini.' });
  }
};

const getGeminiDecisionAnalysis = async (req, res) => {
  const { decisionId } = req.params;

  try {
    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found.' });
    }

    const prosCons = await ProsCons.find({ decisionId });
    const mindset = await Mindset.findOne({ decisionId }); // Assuming mindset is unique per decision

    if (!prosCons || prosCons.length === 0) {
      return res.status(400).json({ error: 'No pros and cons found for this decision. Please add some first.' });
    }

    const analysis = await generateEfficientChoice(decision, prosCons, mindset);
    res.json(analysis);

  } catch (error) {
    console.error('Error in getGeminiDecisionAnalysis controller:', error);
    res.status(500).json({ error: 'Failed to generate decision analysis from Gemini.' });
  }
};


module.exports = {
  getGeminiProsCons,
  getGeminiDecisionAnalysis,
};