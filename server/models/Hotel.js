const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, default: "Madhya Pradesh" },
  city: { type: String, default: "Ujjain" },
  location: { type: String, required: true },
  phone: { type: String, default: "+91 98765 43210" },
  rating: { type: Number, default: 4.5 },
  pricePerNight: { type: Number, required: true },
  image: { type: String },
  badge: { type: String, default: "Verified Stay" },
  amenities: [{ type: String }],
  roomTypes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
