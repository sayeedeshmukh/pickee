const ProsCons = require('../models/ProsCons');
const Mindset = require('../models/Mindset');
const analyzeDecision = require('../utils/analyzeDecision');

const getDecisionAnalysis = async (req, res) => {
    try {
        const decisionId = req.params.id;
        const userPreference = req.body?.userPreference || req.query?.userPreference;

        const prosCons = await ProsCons.find({ decisionId });

        const includeMindset = req.query.includeMindset === 'true';
        const mindset = includeMindset ? await Mindset.findOne({ decisionId }) : null;

        const gutLean = mindset?.gutLean;
        const preference =
            userPreference ||
            (gutLean === 'A' ? 'A' : gutLean === 'B' ? 'B' : undefined);

        const analysis = analyzeDecision({
            prosCons,
            userPreference: preference,
            mindset: includeMindset ? mindset : null,
        });

        res.json(analysis);
    } catch (error) {
        console.error('Analysis Error:', error);
        res.status(500).json({ error: 'Server error during analysis' });
    }
};

module.exports = { getDecisionAnalysis };