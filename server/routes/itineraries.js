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

// GET saved itineraries by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user itineraries" });
  }
});

// POST save itinerary
router.post("/save", async (req, res) => {
  try {
    const { userId, title, region, interests, startDate, endDate, duration, travelers, budget, pace, routeDistance, summary, days } = req.body;
    const newItinerary = new Itinerary({
      userId,
      title,
      region,
      interests,
      startDate,
      endDate,
      duration,
      travelers,
      budget,
      pace,
      routeDistance,
      summary,
      days,
      generatedBy: "gemini"
    });
    const saved = await newItinerary.save();
    res.json(saved);
  } catch (err) {
    console.error("Save itinerary error:", err);
    res.status(500).json({ error: "Failed to save itinerary" });
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
    const temples = await Temple.find(placeQuery).limit(15);

    const allRecords = [...places, ...temples];
    matched = allRecords
      .map((p) => ({
        id: p.id || p._id.toString(),
        name: p.name,
        city: p.city || p.location?.split(",")[0] || p.state || "India",
        state: p.state || "India",
        description: p.subtitle || p.description || p.highlight || "",
        image: p.image || (Array.isArray(p.images) && p.images[0]) || "",
        category: p.category || "Heritage",
        coordinates: p.coordinates || { lat: 20, lng: 78 }
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

    let finalJson = null;

    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("placeholder")) {
      console.log(
        `>>> [GEMINI AI] Calling Gemini for ${regionName} (${numDays} Days)...`,
      );

      const promptText = `You are an expert AI Travel & Pilgrimage Planner for India.
Generate a comprehensive, realistic, and highly detailed Day-by-Day travel itinerary.
- Destination / Region: ${regionName}
- Selected Interests: ${interestsName}
- Duration: ${numDays} Day(s)
- Real Image Pool: ${JSON.stringify(placeImages)}

OUTPUT INSTRUCTIONS:
Return a SINGLE VALID JSON object strictly adhering to this structure:

{
  "destinationTitle": "Catchy title for the trip",
  "summaryParagraph1": "Inviting introductory summary about the region.",
  "summaryParagraph2": "Secondary summary highlighting the main themes.",
  "routeDistance": "approx distance (e.g., '350 Kms')",
  "heroImage": "choose from image pool",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "dayImage": "choose from image pool",
      "morning": {
        "description": "Morning overview",
        "activities": [
          {
            "name": "Exact Name of the Real-World Tourist Place",
            "startTime": "08:00",
            "endTime": "10:00",
            "description": "Detailed description of what the traveler will do here."
          }
        ]
      },
      "afternoon": {
        "description": "Afternoon overview",
        "activities": [
          {
            "name": "Another Real-World Place",
            "startTime": "14:00",
            "endTime": "16:00",
            "description": "Detailed description of afternoon exploration."
          }
        ]
      },
      "evening": {
        "description": "Evening overview",
        "activities": [
          {
            "name": "Evening Activity or Place",
            "startTime": "18:00",
            "endTime": "20:00",
            "description": "Evening leisure or cultural exploration."
          }
        ]
      },
      "highlights": ["Highlight 1", "Highlight 2"]
    }
  ]
}

CRITICAL RULES:
1. GENERATE FROM SCRATCH: Do not rely on any limited databases. Use your vast knowledge of India's geography, tourism, and culture to generate actual, realistic, and famous places for the requested region.
2. NO REPETITIONS: Every single place or activity across the entire itinerary MUST be completely unique. Never visit the same place twice.
3. LOGICAL ROUTING: Ensure the travel between places is geographically possible within the given timeframes.
4. EVERY SECTION MUST HAVE ACTIVITIES: You must provide at least one specific activity with a 'name' and 'startTime' for the morning, afternoon, and evening sections of every single day. Do not leave the activities array empty.
5. STRICT JSON ONLY: Respond ONLY with raw, valid JSON. No markdown tags, no markdown code blocks (like \`\`\`json), no introductory text.

Make sure the "days" array has exactly ${numDays} day objects.`;

      async function generateWithGemini() {
         // 1. Try GoogleGenAI SDK (@google/genai)
        if (GoogleGenAI) {
            const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
            const genModels = [
                "gemini-3.6-flash",
                "gemini-flash-latest",
                "gemini-2.5-flash",
            ];
            for (const m of genModels) {
                try {
                if (ai.models && typeof ai.models.generateContent === "function") {
                    const resAI = await ai.models.generateContent({ model: m, contents: promptText });
                    if (resAI.text) {
                        try {
                           return JSON.parse(resAI.text.replace(/```json|```/g, "").trim());
                        } catch (parseErr) {
                           console.error("Gemini JSON Parse Error:", parseErr, resAI.text);
                        }
                    }
                }
                } catch (e) {
                    console.error(`GoogleGenAI Error with ${m}:`, e.message);
                }
            }
        }
        
        // 2. Try GoogleGenerativeAI SDK (@google/generative-ai)
        if (GoogleGenerativeAI) {
            const modelsToTrySDK = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-2.5-flash"];
            for (const modelName of modelsToTrySDK) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey.trim());
                const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: { temperature: 1.0, responseMimeType: "application/json" },
                });
                const result = await model.generateContent(promptText);
                const candidateText = result.response?.text();
                if (candidateText) {
                     try {
                        return JSON.parse(candidateText.trim());
                     } catch (parseErr) {
                        console.error("GenerativeAI JSON Parse Error:", parseErr, candidateText);
                     }
                }
            } catch (e) {
                console.error(`GoogleGenerativeAI Error with ${modelName}:`, e.message);
            }
            }
        }
        
        // 3. Direct REST API Driver Fallback
        const restEndpoints = [
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey.trim()}`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey.trim()}`,
        ];
        
        for (const geminiUrl of restEndpoints) {
            try {
            const response = await fetch(geminiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
            });
            if (response.ok) {
                const data = await response.json();
                const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (candidateText) {
                    try {
                       return JSON.parse(candidateText.replace(/```json|```/g, "").trim());
                    } catch (parseErr) {
                       console.error("REST API JSON Parse Error:", parseErr, candidateText);
                    }
                }
            } else {
                console.error("REST API HTTP Error:", response.status, await response.text());
            }
            } catch (e) {
                console.error("REST API Fetch Error:", e.message);
            }
        }
        return null;
      }

      finalJson = await generateWithGemini();
    }

    if (!finalJson) {
      console.log(">>> Generating dynamic itinerary fallback using Mongo places...");
      finalJson = buildDynamicItineraryFallback(numDays, selectedStates, selectedInterests, mongoPlaces);
    }

    // Validate and Enrich with real DB data
    const placesMap = {};
    mongoPlaces.forEach(p => { placesMap[p.id] = p; });

    if (finalJson && finalJson.days && Array.isArray(finalJson.days)) {
      finalJson.days.forEach(day => {
        ['morning', 'afternoon', 'evening'].forEach(timeOfDay => {
          if (day[timeOfDay] && Array.isArray(day[timeOfDay].activities)) {
            day[timeOfDay].activities.forEach(activity => {
              if (activity.placeId && placesMap[activity.placeId]) {
                const dbPlace = placesMap[activity.placeId];
                activity.name = dbPlace.name;
                activity.location = dbPlace.city + ", " + dbPlace.state;
                activity.image = dbPlace.image;
                activity.coordinates = dbPlace.coordinates;
                activity.category = dbPlace.category;
              } else if (!activity.name) {
                 activity.name = "Local Visit";
              }
            });
          }
        });
        
        // Populate recommendedExperience if recommendedExperienceId is provided
        if (day.recommendedExperienceId && placesMap[day.recommendedExperienceId]) {
            const dbPlace = placesMap[day.recommendedExperienceId];
            day.recommendedExperience = {
                id: dbPlace.id,
                title: dbPlace.name,
                image: dbPlace.image,
                duration: "2 hours",
                price: "Free"
            };
        }
      });
    }

    return res.json({ source: apiKey ? "gemini-ai" : "dynamic-generator", plan: finalJson });

  } catch (globalErr) {
    console.error("Error in /generate endpoint:", globalErr);
    const fallbackPlan = buildDynamicItineraryFallback(2, ["India"], ["Heritage"], []);
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
  const regionName = Array.isArray(selectedStates) && selectedStates.length > 0 ? selectedStates.join(", ") : "India";
  const placeImages = mongoPlaces.length > 0 ? mongoPlaces.map((p) => p.image) : [
    "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1200"
  ];

  // Keep track of used places to avoid repetition in fallback
  const usedPlaceIds = new Set();
  const getNextAvailablePlace = (startIndex) => {
      if (mongoPlaces.length === 0) return {};
      for (let i = 0; i < mongoPlaces.length; i++) {
          const index = (startIndex + i) % mongoPlaces.length;
          const place = mongoPlaces[index];
          if (place && place.id && !usedPlaceIds.has(place.id)) {
              usedPlaceIds.add(place.id);
              return place;
          }
      }
      return {}; 
  };

  const getRealisticFallback = (dayIndex, region) => {
      const reg = region.toLowerCase();
      // Specifically cater to Aizawl/Mizoram/NorthEast requests
      if (reg.includes("mizoram") || reg.includes("aizawl") || reg.includes("tripura") || reg.includes("sikkim")) {
          const days = [
              {
                  m: { name: "Solomon's Temple, Aizawl", desc: "Start your morning exploring the magnificent Solomon's Temple, a stunning marble structure offering panoramic views of Aizawl city." },
                  a: { name: "Bara Bazar (Local Market)", desc: "Spend the afternoon visiting the bustling local market in Aizawl, shopping for traditional garments and interacting with locals." },
                  e: { name: "Aizawl Street Food & Rest", desc: "Enjoy the evening exploring local street food stalls offering authentic delicacies, followed by a relaxing rest." }
              },
              {
                  m: { name: "Reiek Tlang Peak", desc: "Embark on a morning trek to Reiek Tlang for breathtaking views of the surrounding valleys and Mizo villages." },
                  a: { name: "Mizoram State Museum", desc: "Dive into the rich history and cultural heritage of the region with a guided museum tour." },
                  e: { name: "Cultural Village Walk", desc: "Take a peaceful evening stroll through a traditional village setup and enjoy local folk music." }
              }
          ];
          return days[dayIndex % days.length];
      }
      
      // Generic realistic fallbacks for any other state
      const genericDays = [
          {
              m: { name: `Famous Landmark of ${regionName}`, desc: `Embark on a guided morning tour to witness the rich heritage and vibrant local life that ${regionName} is famous for.` },
              a: { name: `Historic Site & Museum in ${regionName}`, desc: `Explore the historical architecture, ancient artifacts, and scenic landscapes unique to this part of the region.` },
              e: { name: `Popular Local Market & Street Food`, desc: `Experience the evening vibes, taste authentic local street food, and shop for traditional handicrafts.` }
          },
          {
              m: { name: `Nature Trail & Sunrise Point`, desc: `Start your day with a refreshing nature walk and take in the panoramic morning views.` },
              a: { name: `Artisan Village Tour`, desc: `Visit local artisans, see traditional crafts being made, and enjoy a local homestyle lunch.` },
              e: { name: `City Center Leisure & Dining`, desc: `Relax at the vibrant city center, enjoying premium local dining and a peaceful evening atmosphere.` }
          }
      ];
      return genericDays[dayIndex % genericDays.length];
  };

  const daysArr = [];
  for (let d = 1; d <= numDays; d++) {
    const imgIndex = (d - 1) % placeImages.length;
    
    // Pick unique fallback places if available in DB
    const morningPlace = getNextAvailablePlace(d * 3);
    const afternoonPlace = getNextAvailablePlace(d * 3 + 1);
    const eveningPlace = getNextAvailablePlace(d * 3 + 2);

    // Get realistic textual fallbacks if DB places are missing
    const realisticText = getRealisticFallback(d - 1, regionName);
    
    daysArr.push({
      dayNumber: d,
      title: `Exploring the Wonders of ${regionName} - Day ${d}`,
      dayImage: placeImages[imgIndex],
      morning: {
        description: `Start your day early to experience the true essence of ${regionName}.`,
        activities: [
            {
                placeId: morningPlace.id || "",
                name: morningPlace.name || realisticText.m.name,
                startTime: "08:30",
                endTime: "11:00",
                description: realisticText.m.desc
            }
        ]
      },
      afternoon: {
        description: `A deep dive into the local history and natural beauty.`,
        activities: [
            {
                placeId: afternoonPlace.id || "",
                name: afternoonPlace.name || realisticText.a.name,
                startTime: "13:30",
                endTime: "16:00",
                description: realisticText.a.desc
            }
        ]
      },
      evening: {
        description: `Relax and soak in the evening atmosphere.`,
        activities: [
            {
                placeId: eveningPlace.id || "",
                name: eveningPlace.name || realisticText.e.name,
                startTime: "17:30",
                endTime: "20:00",
                description: realisticText.e.desc
            }
        ]
      },
      highlights: ["Heritage", "Culture"],
      recommendedExperienceId: afternoonPlace.id || ""
    });
  }

  return {
    destinationTitle: `Ultimate Guide to ${regionName}`,
    summaryParagraph1: `${regionName} offers a captivating blend of cultural heritage and natural beauty.`,
    summaryParagraph2: `Enjoy a beautifully curated ${numDays}-day journey exploring the very best this region has to offer.`,
    routeDistance: `${numDays * 45} Kms`,
    heroImage: placeImages[0],
    days: daysArr,
  };
}

// Route to generate dynamic curated cards
router.get("/curated-cards", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey.includes("placeholder")) {
        throw new Error("No valid API key");
    }

    const promptText = `You are an expert AI Travel Planner for India.
Generate exactly 4 highly attractive and diverse curated travel itinerary ideas for India. 
Return ONLY a valid JSON array of objects. Do not include markdown tags.
Structure:
[
  { "id": 1, "days": "3 Days", "title": "Jaipur Royal Trail", "description": "Explore majestic forts and vibrant bazaars." },
  { "id": 2, "days": "5 Days", "title": "Kerala Backwaters", "description": "Relax in serene houseboats and lush greenery." }
]`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey.trim()}`;
    
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
    });

    if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
            const parsed = JSON.parse(candidateText.replace(/```json|```/g, "").trim());
            return res.json(parsed);
        }
    }
    throw new Error("Failed to fetch from Gemini");
  } catch (err) {
    console.error("Error generating curated cards, falling back:", err.message);
    // Fallback to default Sikkim cards
    res.json([
      { id: 1, days: "3 Days", title: "Yuksom", description: "Visit Dubdi Monastery & explore ancient trails." },
      { id: 2, days: "4 Days", title: "Pelling", description: "Explore Pemayangtse & Rabdentse ruins with stunning views." },
      { id: 3, days: "5 Days", title: "Ravangla", description: "Breathtaking monasteries, Buddha Park & calm retreat." },
      { id: 4, days: "7 Days", title: "North Sikkim", description: "Lachen, Lachung, Gurudongmar & divine landscapes." }
    ]);
  }
});

module.exports = router;
