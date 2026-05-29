const Mindset = require('../models/Mindset');
const Decision = require('../models/Decision');

const submitMindset = async (req, res) => {
  try {
    const { id: decisionId } = req.params;
    const decision = await Decision.findById(decisionId);
    if (!decision) {
      return res.status(404).json({ error: 'Decision not found.' });
    }

    const payload = {
      decisionId,
      primaryDriver: req.body.primaryDriver,
      thinkingStyle: req.body.thinkingStyle,
      longTermOutlook: req.body.longTermOutlook,
      externalPressure: req.body.externalPressure,
      valuesThatMatter: (req.body.valuesThatMatter || '').trim(),
      fearIfWrong: (req.body.fearIfWrong || '').trim(),
      hopeIfRight: (req.body.hopeIfRight || '').trim(),
      whoIsInfluencing: (req.body.whoIsInfluencing || '').trim(),
      innerConflict: (req.body.innerConflict || '').trim(),
      anythingElse: (req.body.anythingElse || '').trim(),
      gutLean: req.body.gutLean,
    };

    const mindset = await Mindset.findOneAndUpdate(
      { decisionId },
      payload,
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json(mindset);
  } catch (error) {
    console.error('Mindset submit error:', error);
    res.status(500).json({ error: 'Failed to save mindset.' });
  }
};

const getMindset = async (req, res) => {
  try {
    const mindset = await Mindset.findOne({ decisionId: req.params.id });
    if (!mindset) {
      return res.status(404).json({ error: 'No mindset saved for this decision.' });
    }
    res.json(mindset);
  } catch (error) {
    console.error('Mindset fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch mindset.' });
  }
};

module.exports = { submitMindset, getMindset };
