const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Itinerary = require("../models/Itinerary");
const Place = require("../models/Place");
const Temple = require("../models/Temple");

// Try imports for official Google AI SDKs
let GoogleGenAI, GoogleGenerativeAI;
try {
  GoogleGenAI = require("@google/genai").GoogleGenAI;
} catch (e) {}
try {
  GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI;
} catch (e) {}

// GET all static itineraries from MongoDB
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find({});
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch itineraries from MongoDB" });
  }
});

// Helper function to query real places and temples from MongoDB matching region & interest filters
async function getMatchingMongoPlaces(
  selectedStates = [],
  selectedInterests = [],
) {
  let matched = [];
  try {
    const placeQuery = {};
    const cleanStates = (Array.isArray(selectedStates) ? selectedStates : [])
      .map((s) => s.replace(/^All\s+/, "").trim())
      .filter(Boolean);

    if (cleanStates.length > 0) {
      placeQuery.$or = cleanStates.map((st) => ({
        $or: [
          { state: { $regex: st, $options: "i" } },
          { city: { $regex: st, $options: "i" } },
          { location: { $regex: st, $options: "i" } },
        ],
      }));
    }

    const places = await Place.find(placeQuery).limit(15);
    const temples = await Temple.find({}).limit(15);

    const allRecords = [...places, ...temples];
    matched = allRecords
      .map((p) => ({
        id: p.id || p._id,
        name: p.name,
        city: p.city || p.location?.split(",")[0] || p.state || "India",
        state: p.state || "India",
        description: p.subtitle || p.description || "",
        image: p.image || (Array.isArray(p.images) && p.images[0]) || "",
      }))
      .filter((item) => item.image && item.image.startsWith("http"));
  } catch (err) {
    console.error("Error querying places/temples in itineraries.js:", err);
  }
  return matched;
}

// POST generate dynamic AI itinerary using Google Gemini API
router.post("/generate", async (req, res) => {
  try {
    dotenv.config({ override: true });

    const {
      days = "2",
      selectedStates = [],
      selectedInterests = [],
      selectedLengths = [],
      travelPace = "Standard",
      groupType = "Traveler",
      customNotes = "",
    } = req.body || {};

    // Calculate number of days
    let numDays = 2;
    if (Array.isArray(selectedLengths) && selectedLengths.length > 0) {
      const lenStr = selectedLengths[0];
      if (lenStr.includes("1-2")) numDays = 2;
      else if (lenStr.includes("3-4")) numDays = 4;
      else if (lenStr.includes("5-6")) numDays = 5;
      else if (lenStr.includes("7-13")) numDays = 7;
      else if (lenStr.includes("14+")) numDays = 7;
    } else if (days) {
      numDays = Math.min(Math.max(parseInt(days, 10) || 2, 1), 7);
    }

    // Query real places from MongoDB
    const mongoPlaces = await getMatchingMongoPlaces(
      selectedStates,
      selectedInterests,
    );

    const variationSeed = Date.now() + "_" + Math.floor(Math.random() * 100000);
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.API_KEY ||
      process.env.VITE_GEMINI_API_KEY;

    // Default image pool from matched mongo places or high quality fallback images
    const placeImages =
      mongoPlaces.length > 0
        ? mongoPlaces.map((p) => p.image)
        : [
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200",
          ];

    const regionName =
      selectedStates.length > 0 ? selectedStates.join(", ") : "India";
    const interestsName =
      selectedInterests.length > 0
        ? selectedInterests.join(", ")
        : "Heritage, Spiritual & Culture";

    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("placeholder")) {
      console.log(
        `>>> [GEMINI AI] Calling Gemini for ${regionName} (${numDays} Days)...`,
      );

      const promptText = `You are an expert AI Travel & Pilgrimage Planner for India.
Generate a Day-by-Day travel itinerary for a trip with these details:
- Destination / Region: ${regionName}
- Selected Interests: ${interestsName}
- Duration: ${numDays} Day(s)
- Real Places in Database: ${JSON.stringify(mongoPlaces.slice(0, 8))}
- Real Image Pool: ${JSON.stringify(placeImages)}

OUTPUT INSTRUCTIONS:
Return a SINGLE VALID JSON object strictly adhering to this structure:

{
  "destinationTitle": "Blend of heritage and modernity",
  "subtitle": "Discover the best of culture, monuments, and rich history in ${regionName}",
  "summaryParagraph1": "Detailed engaging introduction paragraph about ${regionName}, its history, culture, and unique charm...",
  "summaryParagraph2": "To spend the best ${numDays} days in ${regionName}, plan to explore an exciting mix of heritage, local cuisine, vibrant markets, and iconic landmarks...",
  "routeDistance": "${numDays * 22} Kms",
  "heroImage": "${placeImages[0] || ""}",
  "mapRegionName": "${regionName}",
  "highlights": ["Iconic Monument 1", "Local Bazaar", "Sacred Shrine", "Heritage Site"],
  "sidebarExperience": {
    "title": "Exploring the cultural kaleidoscope of ${regionName}",
    "image": "${placeImages[1] || placeImages[0] || ""}"
  },
  "days": [
    {
      "dayNumber": 1,
      "title": "Feel the magic of ${regionName}",
      "dayImage": "${placeImages[0] || ""}",
      "timeOfDaySections": [
        {
          "timeOfDay": "Morning",
          "paragraphs": [
            "Start your day by exploring the famous historic sites of ${regionName}...",
            "8 am: Visit the local food havens and treat your tastebuds to traditional dishes..."
          ]
        },
        {
          "timeOfDay": "Afternoon",
          "paragraphs": [
            "Spend some time exploring iconic monuments and heritage structures...",
            "2 pm: Head to the vibrant bazaars for local handicrafts and souvenirs..."
          ]
        },
        {
          "timeOfDay": "Evening",
          "paragraphs": [
            "In the evening, take a stroll around the scenic promenades and gardens...",
            "6 pm: Enjoy local dining and authentic dinner experiences..."
          ]
        }
      ]
    }
  ]
}

Make sure "days" array has exactly ${numDays} day objects. Use real place names and image URLs provided.`;

      // 1. Try GoogleGenAI SDK (@google/genai)
      if (GoogleGenAI) {
        try {
          const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
          const genModels = [
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
          ];

          for (const m of genModels) {
            try {
              let responseText;
              if (
                ai.models &&
                typeof ai.models.generateContent === "function"
              ) {
                const resAI = await ai.models.generateContent({
                  model: m,
                  contents: promptText,
                });
                responseText = resAI.text;
              }
              if (responseText) {
                let parsed = JSON.parse(
                  responseText.replace(/```json|```/g, "").trim(),
                );
                return res.json({
                  source: "gemini-ai",
                  model: m,
                  plan: parsed,
                });
              }
            } catch (errM) {}
          }
        } catch (sdkErr1) {}
      }

      // 2. Try GoogleGenerativeAI SDK (@google/generative-ai)
      if (GoogleGenerativeAI) {
        const modelsToTrySDK = [
          "gemini-2.5-flash",
          "gemini-2.0-flash",
          "gemini-1.5-flash",
        ];
        for (const modelName of modelsToTrySDK) {
          try {
            const genAI = new GoogleGenerativeAI(apiKey.trim());
            const model = genAI.getGenerativeModel({
              model: modelName,
              generationConfig: {
                temperature: 1.0,
                responseMimeType: "application/json",
              },
            });
            const result = await model.generateContent(promptText);
            const candidateText = result.response?.text();
            if (candidateText) {
              let parsed = JSON.parse(candidateText.trim());
              return res.json({
                source: "gemini-ai",
                model: modelName,
                plan: parsed,
              });
            }
          } catch (sdkErr) {}
        }
      }

      // 3. Direct REST API Driver Fallback
      const restEndpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
      ];

      for (const geminiUrl of restEndpoints) {
        try {
          const response = await fetch(geminiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          });
          if (response.ok) {
            const data = await response.json();
            const candidateText =
              data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              let cleanJson = candidateText.replace(/```json|```/g, "").trim();
              let parsed = JSON.parse(cleanJson);
              return res.json({
                source: "gemini-ai",
                model: "Gemini REST",
                plan: parsed,
              });
            }
          }
        } catch (modelErr) {}
      }
    }

    // Fallback dynamic generator if key is missing or offline
    console.log(
      ">>> Generating dynamic itinerary fallback using Mongo places...",
    );
    const dynamicPlan = buildDynamicItineraryFallback(
      numDays,
      selectedStates,
      selectedInterests,
      mongoPlaces,
    );
    return res.json({ source: "dynamic-generator", plan: dynamicPlan });
  } catch (globalErr) {
    console.error("Error in /generate endpoint:", globalErr);
    const fallbackPlan = buildDynamicItineraryFallback(
      2,
      ["India"],
      ["Heritage"],
      [],
    );
    return res.json({ source: "fallback", plan: fallbackPlan });
  }
});

// Dynamic Intelligent Itinerary Builder Fallback
function buildDynamicItineraryFallback(
  numDays = 2,
  selectedStates = [],
  selectedInterests = [],
  mongoPlaces = [],
) {
  const regionName =
    Array.isArray(selectedStates) && selectedStates.length > 0
      ? selectedStates.join(", ")
      : "India";

  const placeImages =
    mongoPlaces.length > 0
      ? mongoPlaces.map((p) => p.image)
      : [
          "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&q=80&w=1200",
          "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200",
        ];

  const daysArr = [];
  for (let d = 1; d <= numDays; d++) {
    const imgIndex = (d - 1) % placeImages.length;
    daysArr.push({
      dayNumber: d,
      title: `Feel the magic of ${regionName} - Day ${d}`,
      dayImage: placeImages[imgIndex],
      timeOfDaySections: [
        {
          timeOfDay: "Morning",
          paragraphs: [
            `Start your day early in ${regionName} exploring the morning atmosphere and heritage architecture.`,
            `8 am: Visit iconic local monuments, temples, and taste regional breakfast delicacies.`,
          ],
        },
        {
          timeOfDay: "Afternoon",
          paragraphs: [
            `Spend afternoon hours discovering museums, fort complex, and artisan craft lanes.`,
            `2 pm: Explore local bazaars for traditional textiles and handcrafted souvenirs.`,
          ],
        },
        {
          timeOfDay: "Evening",
          paragraphs: [
            `In the evening take a stroll around riverfront ghats and lakeside gardens.`,
            `6 pm: Experience authentic evening light shows, cultural performances, and regional dinner.`,
          ],
        },
      ],
    });
  }

  return {
    destinationTitle: "Blend of heritage and modernity",
    subtitle: `Discover the best of culture, monuments, and rich history in ${regionName}`,
    summaryParagraph1: `${regionName} is one of the world's most captivating destinations, blending centuries of rich history, architectural grandeur, and vibrant culture.`,
    summaryParagraph2: `To spend the best ${numDays} days in ${regionName}, plan to explore an exciting mix of monuments, bustling markets, traditional cuisine, and scenic promenades.`,
    routeDistance: `${numDays * 22} Kms`,
    heroImage: placeImages[0],
    mapRegionName: regionName,
    highlights: [
      "Heritage Monument",
      "Local Bazaar",
      "Sacred Shrine",
      "Cultural Center",
    ],
    sidebarExperience: {
      title: `Exploring the cultural kaleidoscope of ${regionName}`,
      image: placeImages[1] || placeImages[0],
    },
    days: daysArr,
  };
}

module.exports = router;
