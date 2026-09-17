const mongoose = require('mongoose');

const infrastructureSchema = new mongoose.Schema({
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  category: { 
    type: String, 
    enum: ['transport', 'accommodation', 'sanitation', 'medical', 'information', 'safety'],
    required: true
  },
  availability: { type: String, enum: ['poor', 'moderate', 'good', 'excellent'] },
  condition: { type: String, enum: ['poor', 'moderate', 'good', 'excellent'] },
  capacity: { type: Number }, // percentage or numerical value
  lastInspection: { type: Date, default: Date.now },
  issueCount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'maintenance', 'critical'], default: 'active' },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Infrastructure', infrastructureSchema);
