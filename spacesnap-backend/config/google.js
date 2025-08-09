//config/google.js
const { OAuth2Client } = require("google-auth-library");
const config = require("./env");

// Google OAuth client
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

module.exports = googleClient;