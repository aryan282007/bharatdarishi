const mongoose = require('mongoose');
const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  region: String,
  interests: [String],
  startDate: String,
  endDate: String,
  duration: String,
  travelers: String,
  budget: String,
  pace: String,
  routeDistance: String,
  summary: String,
  days: [mongoose.Schema.Types.Mixed],
  generatedBy: { type: String, default: "gemini" },
}, { timestamps: true });
module.exports = mongoose.model('Itinerary', itinerarySchema);
