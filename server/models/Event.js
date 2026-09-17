const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: "Taxi & City Cabs" },
    date: { type: String, default: "Daily Available" },
    time: { type: String, default: "24/7 Available" },
    location: { type: String },
    city: { type: String, default: "Gangtok" },
    state: { type: String, default: "Sikkim" },
    image: { type: String },
    description: { type: String },
    availableTickets: { type: Number, default: 100 },
    price: { type: Number, default: 1200 },
    badge: { type: String, default: "VERIFIED" },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 150 },
    verified: { type: Boolean, default: true },
    openingHours: { type: String, default: "Open until 11:00 PM" },
    estYear: { type: String, default: "Est. 2015" },
    tags: { type: [String], default: ["Local Expert", "Clean Vehicles", "On-Time"] },
    phone: { type: String, default: "+91 98320 12345" },
    creatorUserId: { type: String },
    creatorEmail: { type: String },
    creatorName: { type: String },
  },
  { timestamps: true, strict: false },
);

module.exports = mongoose.model("Event", eventSchema);

