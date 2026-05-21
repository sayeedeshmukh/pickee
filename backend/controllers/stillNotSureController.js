const Decision = require('../models/Decision');
const ProsCons = require('../models/ProsCons');
const StillNotSure = require('../models/StillNotSure');
const analyzeDecision = require('../utils/analyzeDecision');
const { buildStillNotSureAdvice } = require('../utils/stillNotSureAdvice');

const getStillNotSure = async (req, res) => {
  try {
    const { id: decisionId } = req.params;
    const record = await StillNotSure.findOne({ decisionId });
    if (!record) {
      return res.status(404).json({ error: 'No Still Not Sure responses found for this decision.' });
    }
    res.json(record);
  } catch (error) {
    console.error('getStillNotSure error:', error);
    res.status(500).json({ error: 'Failed to fetch Still Not Sure responses.' });
  }
};

const submitStillNotSure = async (req, res) => {
  try {
    const { id: decisionId } = req.params;
    const { feelings, missingInfo, confidence, helpNeeded, extra, userPreference } = req.body;

    if (!feelings?.trim()) {
      return res.status(400).json({ error: 'Feelings are required.' });
    }
    const confidenceNum = Number(confidence);
    if (!Number.isFinite(confidenceNum) || confidenceNum < 1 || confidenceNum > 10) {
      return res.status(400).json({ error: 'Confidence must be a number between 1 and 10.' });
    }
    if (!['A', 'B'].includes(userPreference)) {
      return res.status(400).json({ error: 'userPreference must be A or B.' });
    }

    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found.' });
    }

    const prosCons = await ProsCons.find({ decisionId });
    const scoreAnalysis = prosCons.length > 0 ? analyzeDecision({ prosCons }) : null;

    const form = {
      feelings: feelings.trim(),
      missingInfo: (missingInfo || '').trim(),
      confidence: confidenceNum,
      helpNeeded: (helpNeeded || '').trim(),
      extra: (extra || '').trim(),
      userPreference,
    };

    const { detectedMindset, advice } = buildStillNotSureAdvice({
      form,
      decision,
      scoreAnalysis,
    });

    const record = await StillNotSure.findOneAndUpdate(
      { decisionId },
      {
        decisionId,
        ...form,
        detectedMindset,
        advice,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({
      detectedMindset,
      advice,
      saved: true,
      record,
    });
  } catch (error) {
    console.error('submitStillNotSure error:', error);
    res.status(500).json({ error: 'Failed to process Still Not Sure responses.' });
  }
};

module.exports = { getStillNotSure, submitStillNotSure };
