const ProsCons = require('../models/ProsCons');
const { isPlaceholderOrVague, normalizeText } = require('../utils/scoring');

function validateProsConsText(text) {
  const trimmed = (text || '').trim();
  if (trimmed.length < 4) {
    return 'Please describe this point in at least a few words.';
  }
  if (!/[A-Za-z0-9]/.test(trimmed)) {
    return 'Please use clear words, not only symbols.';
  }
  if (isPlaceholderOrVague(trimmed)) {
    return 'This looks too vague — try something specific to your situation.';
  }
  return null;
}

// Create a new pro/con
const addProsCons = async (req, res) => {
  try {
    const textError = validateProsConsText(req.body.text);
    if (textError) {
      return res.status(400).json({ error: textError });
    }

    const existing = await ProsCons.find({
      decisionId: req.body.decisionId,
      option: req.body.option,
      type: req.body.type,
    });
    const key = normalizeText(req.body.text);
    const duplicate = existing.find((e) => normalizeText(e.text) === key);
    if (duplicate) {
      return res.status(409).json({
        error: 'You already added a similar point. Edit the existing one or rate it higher.',
        existingId: duplicate._id,
      });
    }

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
    if (req.body.text !== undefined) {
      const textError = validateProsConsText(req.body.text);
      if (textError) {
        return res.status(400).json({ error: textError });
      }
    }
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
