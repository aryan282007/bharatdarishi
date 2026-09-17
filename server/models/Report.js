const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: [
      'Destination Tourism Report', 
      'Tourism Performance Report', 
      'Partner Verification Report', 
      'Booking Report', 
      'Transaction Report', 
      'Safety & Alerts Report', 
      'Infrastructure Report', 
      'Government Action Report', 
      'Tourism Trends Report'
    ],
    required: true 
  },
  title: { type: String, required: true },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  periodStart: { type: Date },
  periodEnd: { type: Date },
  status: { type: String, enum: ['Generated', 'Failed', 'Processing'], default: 'Generated' },
  filtersUsed: { type: mongoose.Schema.Types.Mixed },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  isDemo: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
