const fs = require('fs');
let c = fs.readFileSync('server/routes/admin.js', 'utf8');

const imports = `
const Booking = require('../models/Booking');
const Place = require('../models/Place');
const GovernmentAction = require('../models/GovernmentAction');
const Review = require('../models/Review');
const TourismCircuit = require('../models/TourismCircuit');
const Alert = require('../models/Alert');
const Infrastructure = require('../models/Infrastructure');
const Report = require('../models/Report');
`;

if (!c.includes("const Booking = require")) {
  c = c.replace(/const Event = require\("\.\.\/models\/Event"\);/, 'const Event = require("../models/Event");\n' + imports);
}

const analyticsRoute = `
router.get('/analytics', async (req, res) => {
  try {
    const totalTourists = await User.countDocuments({ role: 'devotee' });
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
`;

if (!c.includes("'/analytics'")) {
  c = c.replace(/router\.get\("\/transactions"/, analyticsRoute + '\nrouter.get("/transactions"');
}

fs.writeFileSync('server/routes/admin.js', c);
