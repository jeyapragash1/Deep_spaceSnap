// middleware/authMiddleware.js

const User = require('../models/User');
const { verifyToken } = require('../utils/auth-tokens');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.temp) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}

module.exports = authMiddleware;