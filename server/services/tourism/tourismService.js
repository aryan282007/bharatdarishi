/**
 * Tourism Intelligence Service
 * Deterministic rules and calculations for Gap Detection and Impact Scores.
 */

// Readiness Formula
// 0.20 * transport + 0.15 * accommodation + 0.15 * sanitation + 0.15 * safety + 0.10 * medical + 0.10 * information + 0.15 * localServices
const calculateReadiness = (metrics) => {
  const { transport = 0, accommodation = 0, sanitation = 0, safety = 0, medical = 0, information = 0, localServices = 0 } = metrics;
  const readiness = 
    0.20 * transport + 
    0.15 * accommodation + 
    0.15 * sanitation + 
    0.15 * safety + 
    0.10 * medical + 
    0.10 * information + 
    0.15 * localServices;
  return Math.round(readiness);
};

// Gap Score Formula
// demand * (1 - readiness / 100)
const calculateGapScore = (metrics) => {
  const demand = metrics.demand || 0;
  const readiness = calculateReadiness(metrics);
  const gapScore = demand * (1 - readiness / 100);
  return Math.round(gapScore);
};

// Priority logic
// 0–34 = LOW, 35–64 = MEDIUM, 65–100 = HIGH
const getGapPriority = (score) => {
  if (score < 35) return 'LOW';
  if (score < 65) return 'MEDIUM';
  return 'HIGH';
};

// Get Gap Reasons based on lowest metrics
const getGapReasons = (metrics) => {
  const indicators = [
    { name: 'Transport availability', key: 'transport', val: metrics.transport || 0 },
    { name: 'Accommodation capacity', key: 'accommodation', val: metrics.accommodation || 0 },
    { name: 'Sanitation facilities', key: 'sanitation', val: metrics.sanitation || 0 },
    { name: 'Safety & Security', key: 'safety', val: metrics.safety || 0 },
    { name: 'Medical facilities', key: 'medical', val: metrics.medical || 0 },
    { name: 'Information access', key: 'information', val: metrics.information || 0 },
    { name: 'Local Tourism Services', key: 'localServices', val: metrics.localServices || 0 }
  ];
  
  // Sort lowest to highest
  indicators.sort((a, b) => a.val - b.val);
  
  return {
    primary: indicators[0],
    secondary: [indicators[1], indicators[2]]
  };
};

// Service Availability derived logic
const calculateServiceAvailability = (metrics) => {
  // Average of transport, accommodation, sanitation, information, localServices
  const { transport = 0, accommodation = 0, sanitation = 0, information = 0, localServices = 0 } = metrics;
  return Math.round((transport + accommodation + sanitation + information + localServices) / 5);
};

// Impact Score Formula
// 0.30 * economicActivity + 0.20 * employment + 0.20 * satisfaction + 0.15 * localParticipation + 0.15 * visitorGrowth
const calculateImpactScore = (metrics) => {
  const { economicActivity = 0, employment = 0, satisfaction = 0, localParticipation = 0, visitorGrowth = 0 } = metrics;
  const impact = 
    0.30 * economicActivity + 
    0.20 * employment + 
    0.20 * satisfaction + 
    0.15 * localParticipation + 
    0.15 * visitorGrowth;
  return Math.round(impact);
};

// Impact Level Logic
// 0–39 = LOW, 40–69 = MODERATE, 70–84 = HIGH, 85–100 = VERY HIGH
const getImpactLevel = (score) => {
  if (score < 40) return 'LOW';
  if (score < 70) return 'MODERATE';
  if (score < 85) return 'HIGH';
  return 'VERY HIGH';
};

// Deterministic Intelligence Template logic
const getDestinationTourismIntelligence = (gapScore, impactScore) => {
  if (impactScore >= 70 && gapScore >= 65) {
    return "Tourism activity is strong while destination readiness requires attention.";
  }
  if (impactScore >= 70 && gapScore < 35) {
    return "Tourism activity is strong and current readiness is supporting present demand.";
  }
  if (impactScore < 40 && gapScore < 35) {
    return "Tourism activity remains limited and current demand is not creating significant infrastructure pressure.";
  }
  if (impactScore < 40 && gapScore >= 65) {
    return "Destination demand is creating pressure despite limited tourism impact indicators.";
  }
  
  // Fallbacks
  if (gapScore >= 65) return "Significant gaps exist in destination readiness requiring immediate attention.";
  if (impactScore >= 70) return "Destination shows highly positive tourism impact indicators.";
  return "Destination shows moderate activity and manageable gaps.";
};
// Google Maps URL Generator
const getGoogleMapsUrl = (destination) => {
  if (!destination) return null;
  
  // 1. Priority: Latitude & Longitude
  if (destination.coordinates && typeof destination.coordinates.lat === 'number' && typeof destination.coordinates.lng === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${destination.coordinates.lat},${destination.coordinates.lng}`;
  }
  
  // 2. Priority: Address/Location string
  if (destination.location) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.location)}`;
  }
  
  // 3. Priority: Name + City + State
  const parts = [];
  if (destination.name) parts.push(destination.name);
  if (destination.city) parts.push(destination.city);
  if (destination.state) parts.push(destination.state);
  
  if (parts.length > 0) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parts.join(', '))}`;
  }
  
  return null;
};

// Google Maps Embed URL Generator (No API Key Required for simple iframe)
const getGoogleMapsEmbedUrl = (destination) => {
  if (!destination) return null;

  // Prefer coordinates if available
  if (destination.coordinates && typeof destination.coordinates.lat === 'number' && typeof destination.coordinates.lng === 'number') {
    return `https://maps.google.com/maps?q=${destination.coordinates.lat},${destination.coordinates.lng}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  // Fallback to address or location string
  const parts = [];
  if (destination.name) parts.push(destination.name);
  if (destination.location) parts.push(destination.location);
  else {
    if (destination.city) parts.push(destination.city);
    if (destination.state) parts.push(destination.state);
  }

  if (parts.length > 0) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(parts.join(', '))}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  return null;
};

module.exports = {
  calculateReadiness,
  calculateGapScore,
  getGapPriority,
  getGapReasons,
  calculateServiceAvailability,
  calculateImpactScore,
  getImpactLevel,
  getDestinationTourismIntelligence,
  getGoogleMapsUrl,
  getGoogleMapsEmbedUrl
};
