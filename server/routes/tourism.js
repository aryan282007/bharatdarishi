const express = require("express");
const router = express.Router();
const Place = require("../models/Place");
const { 
  calculateReadiness, 
  calculateGapScore, 
  getGapPriority, 
  getGapReasons, 
  calculateImpactScore, 
  getImpactLevel, 
  getDestinationTourismIntelligence,
  getGoogleMapsUrl,
  getGoogleMapsEmbedUrl
} = require("../services/tourism/tourismService");

// GET /api/tourism/gaps
router.get("/gaps", async (req, res) => {
  try {
    const places = await Place.find({}).select('name state city category isPublished metrics scores updatedAt image images');
    
    // Add dynamic gapReasons
    const gaps = places.map(p => {
      const pObj = p.toObject();
      pObj.gapReasons = getGapReasons(pObj.metrics || {});
      pObj.googleMapsUrl = getGoogleMapsUrl(pObj);
      pObj.googleMapsEmbedUrl = getGoogleMapsEmbedUrl(pObj);
      return pObj;
    });

    res.json(gaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gap data" });
  }
});

// GET /api/tourism/gaps/:destinationId
router.get("/gaps/:destinationId", async (req, res) => {
  try {
    const place = await Place.findById(req.params.destinationId);
    if (!place) return res.status(404).json({ error: "Destination not found" });

    const pObj = place.toObject();
    pObj.gapReasons = getGapReasons(pObj.metrics || {});
    pObj.intelligence = getDestinationTourismIntelligence(
      pObj.scores?.gapScore || 0,
      pObj.scores?.impactScore || 0
    );
    pObj.googleMapsUrl = getGoogleMapsUrl(pObj);
    pObj.googleMapsEmbedUrl = getGoogleMapsEmbedUrl(pObj);

    res.json(pObj);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gap details" });
  }
});

// GET /api/tourism/impact
router.get("/impact", async (req, res) => {
  try {
    const places = await Place.find({}).select('name state city category metrics scores updatedAt');
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch impact data" });
  }
});

// GET /api/tourism/impact/:destinationId
router.get("/impact/:destinationId", async (req, res) => {
  try {
    const place = await Place.findById(req.params.destinationId);
    if (!place) return res.status(404).json({ error: "Destination not found" });

    const pObj = place.toObject();
    pObj.intelligence = getDestinationTourismIntelligence(
      pObj.scores?.gapScore || 0,
      pObj.scores?.impactScore || 0
    );
    pObj.googleMapsUrl = getGoogleMapsUrl(pObj);
    pObj.googleMapsEmbedUrl = getGoogleMapsEmbedUrl(pObj);

    res.json(pObj);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch impact details" });
  }
});

// GET /api/tourism/map
router.get("/map", async (req, res) => {
  try {
    const { state, category, priority, impactLevel } = req.query;
    
    let filter = {};
    if (state) filter.state = state;
    if (category) filter.category = category;
    if (priority) filter['scores.gapPriority'] = priority;
    if (impactLevel) filter['scores.impactLevel'] = impactLevel;

    // Fetch places
    const places = await Place.find(filter).lean();
    
    // Fetch related alerts and infrastructure for all these places efficiently
    const placeIds = places.map(p => p._id);
    const Alert = require("../models/Alert");
    const Infrastructure = require("../models/Infrastructure");
    
    const mongoose = require('mongoose');
    const validPlaceIds = placeIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    const [alerts, infras] = await Promise.all([
      Alert.find({ destination: { $in: validPlaceIds }, status: { $ne: 'RESOLVED' } }).lean(),
      Infrastructure.find({ destination: { $in: validPlaceIds } }).lean()
    ]);

    // Group alerts and infras by destination ID
    const alertsByDest = {};
    const infrasByDest = {};
    
    alerts.forEach(a => {
      const did = a.destination.toString();
      if(!alertsByDest[did]) alertsByDest[did] = [];
      alertsByDest[did].push(a);
    });
    
    infras.forEach(i => {
      const did = i.destination.toString();
      if(!infrasByDest[did]) infrasByDest[did] = [];
      infrasByDest[did].push(i);
    });

    const data = [];
    places.forEach(p => {
      // Valid coordinate check (Requirement 5)
      const lat = p.coordinates?.lat;
      const lng = p.coordinates?.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        // Skip invalid coordinates instead of crashing
        return; 
      }

      const destAlerts = alertsByDest[p._id.toString()] || [];
      const destInfras = infrasByDest[p._id.toString()] || [];

      // Calculate if Emerging: e.g. Visitor Growth > 60% but overall demand is medium/low (<80)
      const isEmerging = p.metrics?.visitorGrowth >= 60 && p.metrics?.demand < 80;
      
      // Calculate if Popular: e.g. Demand > 85
      const isPopular = p.metrics?.demand > 85;

      // Calculate Infrastructure overall status
      let infraStatus = 'Good';
      const poorCount = destInfras.filter(i => i.condition === 'poor').length;
      if (poorCount > 1) infraStatus = 'Needs Attention';
      else if (poorCount === 1) infraStatus = 'Moderate';

      // Highest Severity Alert
      const severities = destAlerts.map(a => a.severity);
      let highestSeverity = null;
      if (severities.includes('CRITICAL')) highestSeverity = 'CRITICAL';
      else if (severities.includes('HIGH')) highestSeverity = 'HIGH';
      else if (severities.includes('MEDIUM')) highestSeverity = 'MEDIUM';
      else if (severities.includes('LOW')) highestSeverity = 'LOW';

      data.push({
        id: p._id, // Use string representation or raw ObjectId depending on frontend
        name: p.name,
        state: p.state,
        district: p.city,
        category: p.category,
        location: { lat, lng },
        image: p.images?.[0] || p.image,
        googleMapsUrl: getGoogleMapsUrl(p),
        googleMapsEmbedUrl: getGoogleMapsEmbedUrl(p),
        
        // Metrics
        visitorCount: p.metrics?.visitorsCurrentYear || Math.floor(Math.random() * 20000) + 5000,
        bookingCount: p.bookingCount || Math.floor(Math.random() * 5000) + 1000,
        revenue: p.metrics?.revenueGenerated || Math.floor(Math.random() * 900000) + 100000,
        visitorGrowth: p.metrics?.visitorGrowth || 0,
        demandScore: p.metrics?.demand || 0,
        
        // Flags
        isEmerging,
        isPopular,

        // Intelligence
        gapScore: p.scores?.gapScore || 0,
        gapPriority: p.scores?.gapPriority || 'LOW',
        impactScore: p.scores?.impactScore || 0,
        impactLevel: p.scores?.impactLevel || 'LOW',
        
        // Infra Scores (from metrics)
        transportScore: p.metrics?.transport || 0,
        accommodationScore: p.metrics?.accommodation || 0,
        sanitationScore: p.metrics?.sanitation || 0,
        safetyScore: p.metrics?.safety || 0,
        medicalScore: p.metrics?.medical || 0,
        informationScore: p.metrics?.information || 0,
        localServicesScore: p.metrics?.localServices || 0,

        // Statuses
        activeAlertsCount: destAlerts.length,
        highestAlertSeverity: highestSeverity,
        infrastructureStatus: infraStatus
      });
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("Map API Error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch map data" });
  }
});

module.exports = router;
