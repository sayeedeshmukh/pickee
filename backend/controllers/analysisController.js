
const Mindset = require('../models/Mindset');
const ProsCons = require('../models/ProsCons');
const analyzeDecision = require('../utils/analyzeDecision');

const getDecisionAnalysis = async (req, res) => {
    try {
    const decisionId = req.params.id;

    // 1. Fetch mindset for the decision
    const mindset = await Mindset.findOne({ decisionId });
    if (!mindset) return res.status(404).json({ error: 'Mindset not found' });

    // 2. Fetch pros/cons for the decision
    const prosCons = await ProsCons.find({ decisionId });

    // 3. Run the analysis
    const analysis = analyzeDecision({ mindset, prosCons });

    res.json(analysis);
    } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ error: 'Server error during analysis' });
    }
};

module.exports = { getDecisionAnalysis };
