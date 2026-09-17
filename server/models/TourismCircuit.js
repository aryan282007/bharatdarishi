const mongoose = require('mongoose');

const tourismCircuitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  duration: { type: String, required: true },
  category: { type: String, default: 'Heritage' },
  itinerary: [{ 
    day: Number, 
    activities: String 
  }],
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('TourismCircuit', tourismCircuitSchema);