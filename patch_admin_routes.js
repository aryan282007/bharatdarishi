const fs = require('fs');
const file = 'server/routes/admin.js';
let content = fs.readFileSync(file, 'utf8');

// Fix the module.exports issue
content = content.replace(/module\.exports = router;\s*/g, '');
content += '\nmodule.exports = router;\n';

// Fix /transactions fields
content = content.replace(/.populate\("placeId", "name"\)/g, '.populate("destinationId", "name")');
content = content.replace(/.populate\("partnerId", "name"\)/g, '.populate("hotelPartnerId", "name")');

// Add /bookings if not present
if (!content.includes('/bookings')) {
  const bookingsRoute = `
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
`;
  content = content.replace('module.exports = router;', bookingsRoute + '\nmodule.exports = router;');
}

fs.writeFileSync(file, content);
console.log("admin.js patched successfully.");
