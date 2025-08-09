// utils/rate-limits.js
const rateLimit = require('express-rate-limit');

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    msg: "Too many authentication attempts, please try again later",
  },
});

const emailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: { msg: "Too many email requests, please try again later" },
});

module.exports = {
  authLimiter,
  emailLimiter,
};

