const fs = require('fs');
const file = 'server/routes/admin.js';
let content = fs.readFileSync(file, 'utf8');

const patchRoute = `
router.patch('/partners/:id/verify', async (req, res) => {
  try {
    const { status, note } = req.body;
    const partner = await User.findById(req.params.id);
    if (!partner) return res.status(404).json({ error: 'Partner not found' });
    
    partner.verificationStatus = status;
    if(!partner.verificationHistory) partner.verificationHistory = [];
    partner.verificationHistory.push({ status, note, updatedAt: new Date() });
    
    await partner.save();
    res.json(partner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify partner' });
  }
});
`;

if (!content.includes('/partners/:id/verify')) {
  content = content.replace("module.exports = router;", patchRoute + "\nmodule.exports = router;");
  fs.writeFileSync(file, content);
  console.log("Patched admin.js with partner verification PATCH route");
} else {
  console.log("Already patched");
}
