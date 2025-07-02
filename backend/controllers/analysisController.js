const ProsCons = require('../models/ProsCons');
const analyzeDecision = require('../utils/analyzeDecision');

const getDecisionAnalysis = async (req, res) => {
    try {
        const decisionId = req.params.id;

        // Fetch pros/cons for the decision (only needed data now)
        const prosCons = await ProsCons.find({ decisionId });

        // Run the analysis (without mindset)
        const analysis = analyzeDecision({ prosCons });

        res.json(analysis);
    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: 'Server error during analysis' });
    }
};

module.exports = { getDecisionAnalysis };