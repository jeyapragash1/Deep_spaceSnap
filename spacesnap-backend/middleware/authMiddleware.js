// middleware/authMiddleware.js

const User = require('../models/User');
const { verifyToken } = require('../utils/auth-tokens');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header is present and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    // 2. Extract the token from the Authorization header
    const token = authHeader.substring(7); // Remove 'Bearer ' from start

    // 3. Verify the token using your custom utility function
    const decoded = verifyToken(token);

    // 4. Check if token is valid and not a temporary one (if such logic exists)
    if (!decoded || decoded.temp) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // 5. Find the user by email extracted from decoded token
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 6. Attach decoded user data to request object
    req.user = decoded;

    // 7. Proceed to the next middleware or route
    next();

  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;
