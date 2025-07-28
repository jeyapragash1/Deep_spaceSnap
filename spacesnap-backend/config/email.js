// config/email.js
const nodemailer = require("nodemailer");
const config = require("./env");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

module.exports = transporter;
