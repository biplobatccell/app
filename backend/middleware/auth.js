const jwt = require('jsonwebtoken');
const { User, Session } = require('../models');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication Middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    // Check if session exists and is active
    const session = await Session.findOne({
      where: {
        userId: decoded.id,
        token,
        isActive: true
      }
    });

    if (!session) {
      return res.status(401).json({ success: false, message: 'Session expired or invalid' });
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      await session.update({ isActive: false });
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

// Admin Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
  await authenticate(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  authenticateAdmin
};
