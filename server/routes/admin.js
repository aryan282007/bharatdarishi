const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Temple = require("../models/Temple");

const Event = require("../models/Event");

const Booking = require('../models/Booking');
const Place = require('../models/Place');
const GovernmentAction = require('../models/GovernmentAction');
const Review = require('../models/Review');
const TourismCircuit = require('../models/TourismCircuit');
const Alert = require('../models/Alert');
const Infrastructure = require('../models/Infrastructure');
const Report = require('../models/Report');



router.get('/analytics', async (req, res) => {
  try {
    const totalTourists = await User.countDocuments({ role: 'tourist' });
    const verifiedPartners = await User.countDocuments({ verificationStatus: 'Verified' });
    const pendingPartners = await User.countDocuments({ verificationStatus: 'Pending' });
    
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: { $in: ['pending', 'processing'] } });
    
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    const activeDestinations = await Place.countDocuments({ isPublished: true });
    
    const actionCenterStats = {
      total: await GovernmentAction.countDocuments(),
      resolved: await GovernmentAction.countDocuments({ status: 'Resolved' }),
      critical: await GovernmentAction.countDocuments({ priority: 'Critical', status: { $ne: 'Resolved' } })
    };

    res.json({
      totalTourists,
      verifiedPartners,
      pendingPartners,
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue,
      activeDestinations,
      actionCenterStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId", "name email")
      .populate("destinationId", "name")
      .populate("hotelPartnerId", "name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
});


router.patch('/partners/:id/verify', async (req, res) => {
  try {
    const { status, note } = req.body;
    const partner = await User.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    
    partner.verificationStatus = status;
    if(!partner.verificationHistory) partner.verificationHistory = [];
    partner.verificationHistory.push({ status, note, updatedAt: new Date() });
    
    // Update role to hotel if they are verified and applied as a hotel
    if (status === 'VERIFIED' || status === 'Verified') {
      if (partner.userType && partner.userType.toLowerCase() === 'hotel') {
        partner.role = 'hotel';
      }
    }
    
    await partner.save();
    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify partner' });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({}).populate('tourist', 'name email').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch reviews' }); }
});

router.patch('/reviews/:id/status', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(review);
  } catch (err) { res.status(500).json({ error: 'Failed to update review status' }); }
});

router.get('/partners/verification', async (req, res) => {
  try {
    const partners = await User.find({ role: { $in: ['guide', 'hotel', 'artisan', 'driver', 'experience_provider', 'tour_operator', 'local_business'] } }).sort({ createdAt: -1 });
    res.json(partners);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch partners' }); }
});

const { getGoogleMapsUrl, getGoogleMapsEmbedUrl } = require("../services/tourism/tourismService");

router.get('/destinations', async (req, res) => {
  try {
    const places = await Place.find({}).sort({ createdAt: -1 });
    const enrichedPlaces = places.map(p => {
      const pObj = p.toObject();
      pObj.googleMapsUrl = getGoogleMapsUrl(pObj);
      pObj.googleMapsEmbedUrl = getGoogleMapsEmbedUrl(pObj);
      return pObj;
    });
    res.json(enrichedPlaces);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch destinations' }); }
});

router.post('/destinations', async (req, res) => {
  try {
    const newPlace = new Place({ ...req.body, id: req.body.name.toLowerCase().replace(/\s+/g, '-') });
    await newPlace.save();
    res.json(newPlace);
  } catch (err) { res.status(500).json({ error: 'Failed to create destination' }); }
});

router.put('/destinations/:id', async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(place);
  } catch (err) { res.status(500).json({ error: 'Failed to update destination' }); }
});

router.delete('/destinations/:id', async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Failed to delete destination' }); }
});

router.get('/circuits', async (req, res) => {
  try {
    const circuits = await TourismCircuit.find({}).populate('destinations').sort({ createdAt: -1 });
    const enrichedCircuits = circuits.map(c => {
      const cObj = c.toObject();
      if (cObj.destinations && Array.isArray(cObj.destinations)) {
        cObj.destinations = cObj.destinations.map(d => {
          d.googleMapsUrl = getGoogleMapsUrl(d);
          return d;
        });
      }
      return cObj;
    });
    res.json(enrichedCircuits);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch circuits' }); }
});

router.get('/actions', async (req, res) => {
  try {
    const actions = await GovernmentAction.find({}).populate('destination').sort({ createdAt: -1 });
    res.json(actions);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch actions' }); }
});

router.post('/actions', async (req, res) => {
  try {
    const newAction = new GovernmentAction(req.body);
    await newAction.save();
    res.json(newAction);
  } catch (err) { res.status(500).json({ error: 'Failed to create action' }); }
});

router.patch('/actions/:id/status', async (req, res) => {
  try {
    const action = await GovernmentAction.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(action);
  } catch (err) { res.status(500).json({ error: 'Failed to update action status' }); }
});

router.get('/reports', async (req, res) => {
  try {
    const reports = await Report.find({}).populate('destinationId').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch reports' }); }
});


router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId", "name email")
      .populate("destinationId", "name")
      .populate("hotelPartnerId", "name")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

module.exports = router;
