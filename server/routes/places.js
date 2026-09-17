const express = require("express");
const router = express.Router();
const Place = require("../models/Place");

// GET /api/places - Get all places from MongoDB
router.get("/", async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (err) {
    console.error("Error in GET /api/places:", err);
    res.status(500).json({ message: "Server error fetching places", error: err.message });
  }
});

// GET /api/places/:id - Get place by ID, _id, or slug directly from MongoDB
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || id === "null") {
      return res.status(400).json({ message: "Invalid place ID parameter" });
    }

    let place = null;

    // 1. Exact string 'id' match
    place = await Place.findOne({ id: id });

    // 2. Case-insensitive string 'id' match
    if (!place) {
      place = await Place.findOne({
        id: { $regex: new RegExp(`^${id}$`, "i") },
      });
    }

    // 3. Mongo _id match if valid 24-char hex string
    if (!place && /^[0-9a-fA-F]{24}$/.test(id)) {
      place = await Place.findById(id);
    }

    // 4. Match by slugified name (e.g., "shanti-stupa" -> "Shanti Stupa")
    if (!place) {
      const formattedName = id.replace(/-/g, " ");
      place = await Place.findOne({
        name: { $regex: new RegExp(`^${formattedName}$`, "i") },
      });
    }

    // 5. Partial string match on id or name
    if (!place) {
      const cleanId = id.replace(/-(featured|corridor|site|temple|monument)/gi, "");
      place = await Place.findOne({
        $or: [
          { id: { $regex: cleanId, $options: "i" } },
          { name: { $regex: cleanId.replace(/-/g, " "), $options: "i" } },
        ],
      });
    }

    if (!place) {
      return res.status(404).json({ message: "Place not found in MongoDB" });
    }

    res.json(place);
  } catch (err) {
    console.error("Error in GET /api/places/:id:", err);
    res.status(500).json({
      message: "Server error fetching place details from MongoDB",
      error: err.message,
    });
  }
});

module.exports = router;
