// utils/auth-tokens.js
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const RefreshToken = require('../models/RefreshToken');

// JWT token generation and verification
const generateTokens = async (user) => {
  const payload = { 
    userId: user._id, 
    email: user.email, 
    isEmailVerified: user.isEmailVerified 
  };
  
  const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  // Store refresh token in database
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  
  return { accessToken, refreshToken };
};

// Verify JWT Token
const verifyToken = (token, secret = config.JWT_SECRET) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  verifyToken,
};