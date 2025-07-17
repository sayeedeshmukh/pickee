const ProsCons = require('../models/ProsCons');
const analyzeDecision = require('../utils/analyzeDecision');

const getDecisionAnalysis = async (req, res) => {
    try {
        const decisionId = req.params.id;
        // Accept userPreference from query or body
        const userPreference = req.body?.userPreference || req.query?.userPreference;

        // Fetch pros/cons for the decision (only needed data now)
        const prosCons = await ProsCons.find({ decisionId });

        // Run the analysis (with optional userPreference)
        const analysis = analyzeDecision({ prosCons, userPreference });

        res.json(analysis);
    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: 'Server error during analysis' });
    }
};

module.exports = { getDecisionAnalysis };