const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['Place', 'Hotel', 'Event'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['approved', 'hidden', 'reported'], 
    default: 'approved' 
  },
  reportReason: { type: String, default: '' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Review', reviewSchema);