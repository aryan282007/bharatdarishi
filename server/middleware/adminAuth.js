const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./auth');

function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired authentication token. Please sign in again.' });
    }
    
    // Check if role is official or any new admin role
    const adminRoles = [
      'official', 'admin', 'SUPER_ADMIN', 'TOURISM_AUTHORITY', 
      'VERIFICATION_OFFICER', 'CONTENT_MANAGER', 'SUPPORT_ADMIN'
    ];
    
    const isOfficial = adminRoles.includes(decoded.role);

    if (!isOfficial) {
      return res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
    }
    req.user = decoded;
    next();
  });
}

module.exports = { requireAdmin };
