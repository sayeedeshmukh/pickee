const mongoose = require('mongoose');

const prosConsSchema = new mongoose.Schema({
  decisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Decision',
    required: true,
  },
  option: {
    type: String, // "A" or "B"
    required: true,
    enum: ["A", "B"]
  },
  type: {
    type: String, // "pro" or "con"
    required: true,
    enum: ["pro", "con"]
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number, // 1 to 5
    required: true,
    min: 1,
    max: 5
  },
  source: {
    type: String, // "user" or "ai"
    required: true,
    enum: ["user", "ai"],
  }
}, { timestamps: true });

module.exports = mongoose.model('ProsCons', prosConsSchema);