const Decision = require('../models/Decision');
const User = require('../models/User');

// Create new decision with empty pros/cons
const createDecision = async (req, res) => {
  try {
    let newDecision;
    if (req.user && req.user.id) {
      newDecision = new Decision({ ...req.body, user: req.user.id });
    } else {
      newDecision = new Decision(req.body);
    }
    const saved = await newDecision.save();
    // If user is logged in, add decision to user's decisions array
    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, { $push: { decisions: saved._id } });
    }
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

// Fetch all decisions for the logged-in user
const getUserDecisions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('decisions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.decisions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user decisions', error });
  }
};

module.exports = {
  createDecision,
  getDecision,
  getUserDecisions
};
