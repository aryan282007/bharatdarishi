const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['safety', 'scam', 'transport', 'medical', 'infrastructure', 'weather', 'service issue', 'other'],
    required: true
  },
  severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'LOW' },
  status: { type: String, enum: ['OPEN', 'INVESTIGATING', 'RESOLVED'], default: 'OPEN' },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
