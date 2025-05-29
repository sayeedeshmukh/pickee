const mongoose = require('mongoose');

const mindsetSchema = new mongoose.Schema({
  decisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decision',
    required: true,
  },
  clarityLevel: String,         // e.g. "Clear", "Confused"
  fearOfRegret: String,         // e.g. "High", "Low"
  emotionalAttachment: String, // e.g. "Strong", "None"
  longTermThinking: String,     // e.g. "Yes", "No"
  practicalApproach: String,    // e.g. "Always", "Sometimes"
  notes: String,                // optional thoughts by user
}, { timestamps: true });

module.exports = mongoose.model('Mindset', mindsetSchema);
