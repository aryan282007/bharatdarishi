const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticateToken, JWT_SECRET } = require("../middleware/auth");

function formatUserObj(user) {
  return {
    id: user._id,
    name: user.name || '',
    email: user.email,
    role: user.role,
    userType: user.userType || 'Tourist',
    serviceCategory: user.serviceCategory || '',
    isApproved: user.isApproved,
    hotelName: user.hotelName || '',
    contactPhone: user.contactPhone || '',
    hotelAddress: user.hotelAddress || '',
    hotelDescription: user.hotelDescription || '',
    documentUrl: user.documentUrl || '',
    specialization: user.specialization || '',
    artForm: user.artForm || '',
    vehicleType: user.vehicleType || '',
    vehicleNumber: user.vehicleNumber || '',
    licenseNumber: user.licenseNumber || '',
    amenities: user.amenities || [],
    checkInTime: user.checkInTime || '12:00 PM',
    checkOutTime: user.checkOutTime || '11:00 AM',
    hotelImage: user.hotelImage || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200'
  };
}

// POST /api/auth/upload-doc (ImageKit Upload Handler)
router.post("/upload-doc", async (req, res) => {
  try {
    const { imageBase64, fileName } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "No image payload provided for document upload." });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const isRealKey = privateKey && privateKey !== "your_imagekit_private_key" && privateKey.trim() !== "";

    if (isRealKey) {
      const formData = new URLSearchParams();
      formData.append("file", imageBase64);
      formData.append("fileName", fileName || `doc_${Date.now()}.jpg`);
      formData.append("useUniqueFileName", "true");

      const ikResponse = await axios.post("https://upload.imagekit.io/api/v1/files/upload", formData, {
        headers: {
          "Authorization": `Basic ${Buffer.from(privateKey + ":").toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      if (ikResponse.data && ikResponse.data.url) {
        return res.json({ success: true, url: ikResponse.data.url });
      }
    }

    // Fallback if key is not yet set
    return res.json({ 
      success: true, 
      url: imageBase64,
      note: "Document preview loaded. Add IMAGEKIT_PRIVATE_KEY in server/.env for cloud CDN storage." 
    });
  } catch (err) {
    console.error("Document Upload Error:", err.response?.data || err.message);
    return res.json({ 
      success: true, 
      url: req.body.imageBase64,
      note: "Saved as local image data." 
    });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email address and password." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ 
        error: "We couldn't find an account registered with this email address. Please check your email or register a new account." 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: "The password you entered is incorrect. Please double-check your password and try again." 
      });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Welcome back! Login successful.",
      token,
      user: formatUserObj(user)
    });
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred during login. Please try again." });
  }
});

// POST /api/auth/signup (Instant Active Account creation for all roles)
router.post("/signup", async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      userType, 
      serviceCategory,
      hotelName, 
      contactPhone,
      hotelAddress,
      hotelDescription,
      documentUrl,
      specialization,
      artForm,
      vehicleType,
      vehicleNumber,
      licenseNumber
    } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ error: "Full Name, Email Address, and Password are all required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const allowedRoles = ['tourist', 'service', 'services', 'devotee', 'hotel'];
    const selectedRole = allowedRoles.includes(role) ? role : 'tourist';

    // Check if account already exists with this email
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ 
        error: "An account with this email address already exists. Only one account can be registered per email. Please sign in to your existing account." 
      });
    }

    // Ensure documentUrl is safe for MongoDB document storage
    let safeDocUrl = documentUrl || '';
    if (safeDocUrl.startsWith('data:') && safeDocUrl.length > 300000) {
      safeDocUrl = safeDocUrl.substring(0, 300000);
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role: selectedRole,
      userType: ['service', 'services'].includes(selectedRole) ? (serviceCategory || 'Service Provider') : 'Tourist',
      serviceCategory: serviceCategory || '',
      isApproved: true, // Auto approved instantly
      hotelName: hotelName || '',
      contactPhone: contactPhone || '',
      hotelAddress: hotelAddress || '',
      hotelDescription: hotelDescription || '',
      documentUrl: safeDocUrl,
      specialization: specialization || '',
      artForm: artForm || '',
      vehicleType: vehicleType || '',
      vehicleNumber: vehicleNumber || '',
      licenseNumber: licenseNumber || ''
    });

    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Account created successfully!",
      token,
      user: formatUserObj(user)
    });
  } catch (err) {
    console.error("Signup Error Detailed:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: "An account with this email address already exists. Please sign in instead." 
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message || "Registration failed. Please check your details and try again." });
  }
});

// GET /api/auth/session
router.get("/session", async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.json({ user: null });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) return res.json({ user: null });
    try {
      const user = await User.findById(decoded.userId);
      if (!user) return res.json({ user: null });
      res.json({ user: formatUserObj(user) });
    } catch {
      res.json({ user: null });
    }
  });
});

// PUT /api/auth/profile (Update User & Hotel Details)
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const {
      name,
      hotelName,
      contactPhone,
      hotelAddress,
      hotelDescription,
      amenities,
      checkInTime,
      checkOutTime,
      hotelImage
    } = req.body;

    if (name) user.name = name.trim();
    if (hotelName !== undefined) user.hotelName = hotelName.trim();
    if (contactPhone !== undefined) user.contactPhone = contactPhone.trim();
    if (hotelAddress !== undefined) user.hotelAddress = hotelAddress.trim();
    if (hotelDescription !== undefined) user.hotelDescription = hotelDescription.trim();
    if (Array.isArray(amenities)) user.amenities = amenities;
    if (checkInTime !== undefined) user.checkInTime = checkInTime.trim();
    if (checkOutTime !== undefined) user.checkOutTime = checkOutTime.trim();
    if (hotelImage !== undefined) user.hotelImage = hotelImage.trim();

    await user.save();

    res.json({
      message: "Hotel profile updated successfully!",
      user: formatUserObj(user)
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: err.message || "Failed to update hotel profile." });
  }
});

module.exports = router;
