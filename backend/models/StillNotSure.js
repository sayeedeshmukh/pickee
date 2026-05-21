const mongoose = require('mongoose');

const stillNotSureSchema = new mongoose.Schema(
  {
    decisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Decision',
      required: true,
      unique: true,
    },
    feelings: { type: String, required: true },
    missingInfo: { type: String, default: '' },
    confidence: { type: Number, required: true },
    helpNeeded: { type: String, default: '' },
    extra: { type: String, default: '' },
    userPreference: { type: String, enum: ['A', 'B'], required: true },
    detectedMindset: { type: String },
    advice: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StillNotSure', stillNotSureSchema);
