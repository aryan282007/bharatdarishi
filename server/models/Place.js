const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  title: { type: String },
  body: { type: String },
  paragraphs: [{ type: String }],
  image: { type: String }, // Optional section inline feature image
});

const nearbyAttractionSchema = new mongoose.Schema({
  name: { type: String },
  distance: { type: String },
  description: { type: String },
});

const blogSchema = new mongoose.Schema({
  title: { type: String },
  author: { type: String, default: "BharatDarshi Travel Team" },
  readTime: { type: String, default: "6 min read" },
  publishDate: { type: String, default: "September 2026" },
  leadParagraphs: [{ type: String }],
  sections: [sectionSchema],
});

const relatedExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  targetPlaceId: { type: String },
});

const placeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String },
    location: { type: String },
    city: { type: String },
    state: { type: String },
    coordinates: {
      lat: { type: Number, default: 23.6321 },
      lng: { type: Number, default: 84.2709 },
    },
    image: { type: String, required: true },
    images: [{ type: String }],
    timings: {
      opening: { type: String, default: "05:00 AM" },
      closing: { type: String, default: "09:00 PM" },
      display: { type: String, default: "Opening time - 05:00 AM | Closing time - 09:00 PM" },
    },
    weather: {
      tempRange: { type: String, default: "2.3 - 28.8 °C" },
      month: { type: String, default: "September" }
    },
    nearestAirport: { type: String, default: "Birsa Munda Airport (IXL), Ranchi" },
    nearestRailway: { type: String, default: "Ranchi Railway Station (RNC)" },
    experienceCard: {
      label: { type: String, default: "Experience" },
      title: { type: String, default: "Shopping guide - Souvenirs & bikepacking tour" },
      image: { type: String }
    },
    description: { type: String },
    leadParagraphs: [{ type: String }],
    sections: [sectionSchema],
    blog: blogSchema,
    relatedExperiences: [relatedExperienceSchema],
    experiences: [{ type: String }],
    nearbyAttractions: [nearbyAttractionSchema],

    // Admin / Destination Management fields
    category: { type: String, default: "Heritage" },
    entryFee: { type: String, default: "Free" },
    bestTimeToVisit: { type: String, default: "October to March" },
    safetyInformation: { type: String, default: "" },
    availableServices: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    // Core Analytics / Metrics (Normalized 0-100)
    metrics: {
      demand: { type: Number, default: 0 },
      transport: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      sanitation: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      medical: { type: Number, default: 0 },
      information: { type: Number, default: 0 },
      localServices: { type: Number, default: 0 },
      
      economicActivity: { type: Number, default: 0 },
      employment: { type: Number, default: 0 },
      visitorGrowth: { type: Number, default: 0 },
      localParticipation: { type: Number, default: 0 },
      satisfaction: { type: Number, default: 0 },
      serviceAvailability: { type: Number, default: 0 }
    },
    // Calculated Scores
    scores: {
      gapScore: { type: Number, default: 0 },
      gapPriority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', ''], default: '' },
      readinessScore: { type: Number, default: 0 },
      impactScore: { type: Number, default: 0 },
      impactLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'VERY HIGH', ''], default: '' },
      calculatedAt: { type: Date }
    },
    bookingCount: { type: Number, default: 0 },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", placeSchema);
