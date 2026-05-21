const { generateProsCons, generateEfficientChoice } = require('../utils/aiService');
const Decision = require('../models/Decision'); 
const ProsCons = require('../models/ProsCons'); 

// This controller will handle the request for generating initial pros/cons and save them to DB
const getGeminiProsCons = async (req, res) => {
  const { optionA, optionB, decisionId } = req.body;

  if (!optionA || !optionB || !decisionId) {
    return res.status(400).json({ error: 'Option A, Option B, and decisionId are required.' });
  }

  try {
    const suggestions = await generateProsCons(optionA, optionB);
    console.log('Generated AI suggestions:', JSON.stringify(suggestions, null, 2));
    
    // Save AI suggestions to database
    const prosConsToSave = [];
    
    // Save Option A pros
    if (suggestions.optionA && suggestions.optionA.pros) {
      suggestions.optionA.pros.forEach(proText => {
        prosConsToSave.push({
          decisionId,
          option: 'A',
          type: 'pro',
          text: proText,
          rating: 3, // Default rating for AI suggestions
          source: 'ai'
        });
      });
    }
    
    // Save Option A cons
    if (suggestions.optionA && suggestions.optionA.cons) {
      suggestions.optionA.cons.forEach(conText => {
        prosConsToSave.push({
          decisionId,
          option: 'A',
          type: 'con',
          text: conText,
          rating: 3, // Default rating for AI suggestions
          source: 'ai'
        });
      });
    }
    
    // Save Option B pros
    if (suggestions.optionB && suggestions.optionB.pros) {
      suggestions.optionB.pros.forEach(proText => {
        prosConsToSave.push({
          decisionId,
          option: 'B',
          type: 'pro',
          text: proText,
          rating: 3, // Default rating for AI suggestions
          source: 'ai'
        });
      });
    }
    
    // Save Option B cons
    if (suggestions.optionB && suggestions.optionB.cons) {
      suggestions.optionB.cons.forEach(conText => {
        prosConsToSave.push({
          decisionId,
          option: 'B',
          type: 'con',
          text: conText,
          rating: 3, // Default rating for AI suggestions
          source: 'ai'
        });
      });
    }
    
    // Save all AI suggestions to database.
    // Important: do not skip insert when Gemini failed and returned fallback text.
    // Previously we skipped if any text contained "AI couldn't come up", which left
    // the DB empty and the /rate page showed "No pros yet" with no way to recover.
    let savedCount = 0;
    if (prosConsToSave.length > 0) {
      await ProsCons.insertMany(prosConsToSave);
      savedCount = prosConsToSave.length;
      console.log(`Saved ${savedCount} AI suggestions to database`);
    }
    
    res.json({ 
      success: true, 
      message: savedCount > 0
        ? `Generated and saved ${savedCount} AI suggestions`
        : 'Generated AI suggestions (not saved)',
      suggestions 
    });
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

    if (!prosCons || prosCons.length === 0) {
      return res.status(400).json({ error: 'No pros and cons found for this decision. Please add some first.' });
    }

    const analysis = await generateEfficientChoice(decision, prosCons, null);
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