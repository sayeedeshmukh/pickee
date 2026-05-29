const mongoose = require('mongoose');

const mindsetSchema = new mongoose.Schema(
  {
    decisionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Decision',
      required: true,
      unique: true,
    },
    primaryDriver: {
      type: String,
      enum: ['fear', 'desire', 'both'],
    },
    thinkingStyle: {
      type: String,
      enum: ['logic', 'emotion', 'mixed'],
    },
    longTermOutlook: {
      type: String,
      enum: ['aligned', 'uncertain', 'misaligned'],
    },
    externalPressure: {
      type: String,
      enum: ['none', 'some', 'heavy'],
    },
    valuesThatMatter: String,
    fearIfWrong: String,
    hopeIfRight: String,
    whoIsInfluencing: String,
    innerConflict: String,
    anythingElse: String,
    gutLean: { type: String, enum: ['A', 'B', 'unsure'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mindset', mindsetSchema);
