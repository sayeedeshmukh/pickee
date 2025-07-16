const ProsCons = require('../models/ProsCons');

// Create a new pro/con
const addProsCons = async (req, res) => {
  try {
    const item = await ProsCons.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all pros/cons for a decision
const getProsConsByDecision = async (req, res) => {
  try {
    const { decisionId } = req.params;
    const items = await ProsCons.find({ decisionId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a pro/con
const updateProsCons = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ProsCons.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ error: 'Pro/con not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a pro/con
const deleteProsCons = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ProsCons.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: 'Pro/con not found' });
    }
    res.json({ message: 'Pro/con deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addProsCons, getProsConsByDecision, updateProsCons, deleteProsCons };
