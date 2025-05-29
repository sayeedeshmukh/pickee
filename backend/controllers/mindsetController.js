const Mindset = require('../models/Mindset');

const createMindset = async (req, res) => {
  try {
    const mindset = await Mindset.create(req.body);
    res.status(201).json(mindset);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMindset = async (req, res) => {
  try {
    const mindset = await Mindset.findOne({ decisionId: req.params.id });
    if (!mindset) {
      return res.status(404).json({ error: 'Mindset not found' });
    }
    res.json(mindset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createMindset, getMindset };
