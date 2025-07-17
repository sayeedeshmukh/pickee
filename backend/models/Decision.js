const mongoose = require('mongoose');

const reasonSchema = new mongoose.Schema({
  text: String,
  type: { type: String, enum: ['emotional', 'practical'] },
  score: { type: Number, default: 0 },
  userAdded: { type: Boolean, default: false }
});

const optionSchema = new mongoose.Schema({
  title: String,
  pros: [reasonSchema],
  cons: [reasonSchema]
});

const decisionSchema = new mongoose.Schema({
  optionA: optionSchema,
  optionB: optionSchema,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Decision', decisionSchema);
