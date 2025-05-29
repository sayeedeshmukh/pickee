const Decision = require('../models/Decision');

// Create new decision with empty pros/cons
const createDecision = async (req, res) => {
  try {
    const newDecision = new Decision(req.body);
    const saved = await newDecision.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create decision', error });
  }
};

// Fetch a decision by ID
const getDecision = async (req, res) => {
  try {
    const decision = await Decision.findById(req.params.id);
    res.json(decision);
  } catch (error) {
    res.status(404).json({ message: 'Decision not found', error });
  }
};

module.exports = {
  createDecision,
  getDecision
};
