const fs = require('fs');
const file = 'server/seed/seed.js';
let content = fs.readFileSync(file, 'utf8');

// I will write a massive Node.js script to patch seed.js
// so that it requires the tourismService and uses it to calculate scores.
const patchCode = `
const {
  calculateReadiness,
  calculateGapScore,
  getGapPriority,
  calculateServiceAvailability,
  calculateImpactScore,
  getImpactLevel
} = require('../services/tourism/tourismService');

// Patch mpDestinations in seed.js to have detailed metrics instead of flat gap/impact
// Actually, it's easier to modify the insert logic directly.
`;

let newContent = content.replace(
  "const Report = require('../models/Report');",
  "const Report = require('../models/Report');\nconst { calculateReadiness, calculateGapScore, getGapPriority, calculateServiceAvailability, calculateImpactScore, getImpactLevel } = require('../services/tourism/tourismService');"
);

// We want to replace the destinations loop.
const oldLoopStart = "const placesToInsert = [];";
const oldLoopEnd = "await Place.insertMany(placesToInsert, { ordered: false });";

const newLoop = `
    const placesToInsert = [];
    for (let d of mpDestinations) {
      let slug = d.name.toLowerCase().replace(/ /g, '-') + '-demo';
      
      // Default baseline
      let metrics = {
        demand: Math.floor(40 + Math.random() * 40),
        transport: Math.floor(40 + Math.random() * 40),
        accommodation: Math.floor(40 + Math.random() * 40),
        sanitation: Math.floor(40 + Math.random() * 40),
        safety: Math.floor(50 + Math.random() * 30),
        medical: Math.floor(40 + Math.random() * 40),
        information: Math.floor(40 + Math.random() * 40),
        localServices: Math.floor(40 + Math.random() * 40),
        
        economicActivity: Math.floor(40 + Math.random() * 40),
        employment: Math.floor(40 + Math.random() * 40),
        visitorGrowth: Math.floor(40 + Math.random() * 40),
        localParticipation: Math.floor(40 + Math.random() * 40),
        satisfaction: Math.floor(50 + Math.random() * 30)
      };

      // Intentional Scenarios
      if (d.name === 'Mandu') { // HIGH IMPACT + HIGH GAP
        metrics = {
          demand: 91,
          transport: 31,
          accommodation: 70,
          sanitation: 42,
          safety: 80,
          medical: 54,
          information: 62,
          localServices: 47,
          
          economicActivity: 88,
          employment: 72,
          satisfaction: 86,
          localParticipation: 91,
          visitorGrowth: 82
        };
      } else if (d.name === 'Ujjain') { // HIGH IMPACT + LOW GAP
        metrics = {
          demand: 94,
          transport: 85,
          accommodation: 92,
          sanitation: 80,
          safety: 95,
          medical: 78,
          information: 90,
          localServices: 88,
          
          economicActivity: 95,
          employment: 88,
          satisfaction: 92,
          localParticipation: 85,
          visitorGrowth: 80
        };
      } else if (d.name === 'Chanderi') { // EMERGING
        metrics = {
          demand: 55,
          transport: 45,
          accommodation: 40,
          sanitation: 50,
          safety: 60,
          medical: 40,
          information: 55,
          localServices: 65,
          
          economicActivity: 60,
          employment: 65,
          satisfaction: 85,
          localParticipation: 90,
          visitorGrowth: 95
        };
      } else if (d.name === 'Pachmarhi') { // LOW IMPACT + LOW GAP
        metrics = {
          demand: 40,
          transport: 80,
          accommodation: 75,
          sanitation: 70,
          safety: 85,
          medical: 65,
          information: 70,
          localServices: 60,
          
          economicActivity: 45,
          employment: 50,
          satisfaction: 70,
          localParticipation: 55,
          visitorGrowth: 35
        };
      }

      metrics.serviceAvailability = calculateServiceAvailability(metrics);

      let gapScore = calculateGapScore(metrics);
      let readinessScore = calculateReadiness(metrics);
      let impactScore = calculateImpactScore(metrics);
      
      let scores = {
        gapScore: gapScore,
        gapPriority: getGapPriority(gapScore),
        readinessScore: readinessScore,
        impactScore: impactScore,
        impactLevel: getImpactLevel(impactScore),
        calculatedAt: new Date()
      };

      placesToInsert.push({
        id: slug,
        name: d.name,
        subtitle: d.desc,
        city: d.city,
        state: d.state,
        category: d.category,
        description: d.desc,
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=800',
        coordinates: { lat: d.lat, lng: d.lng },
        isDemo: true,
        isPublished: true,
        metrics: metrics,
        scores: scores
      });
    }

    let createdPlaces = [];
    try {
      await Place.insertMany(placesToInsert, { ordered: false });`;

const startIndex = newContent.indexOf(oldLoopStart);
const endIndex = newContent.indexOf(oldLoopEnd) + oldLoopEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  newContent = newContent.substring(0, startIndex) + newLoop + newContent.substring(endIndex);
  fs.writeFileSync(file, newContent);
  console.log("Seed patched");
} else {
  console.log("Could not find loop to patch.");
}
