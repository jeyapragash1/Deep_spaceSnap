// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/email");
const { generateTokens, verifyToken } = require("../utils/auth-tokens");
const { emailLimiter, authLimiter } = require("../utils/rate-limits");
const googleClient = require("../config/google");
const authMiddleware = require("../middleware/authMiddleware");
const RefreshToken = require("../models/RefreshToken");
const { v4: uuidv4 } = require("uuid");

// --- REGISTER ROUTE ---
router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role, confirmPassword } = req.body;

    if (!email || !password || !name || !role || !confirmPassword) {
      return res.status(400).json({
        msg: "Email, password, name, role, and confirm Password are required",
      });
    }

    // check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    // check role is 'designer' or 'registered'
    if (!["designer", "registered"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      name,
      role,
      password: hashedPassword,
      authMethod: "email",
      isEmailVerified: false,
    });

    // Generate verification token using uuid
    const verificationToken = uuidv4();

    // Store verification token
    await EmailVerification.create({
      userId: user._id,
      token: verificationToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
    });

    // Send verification email
    await sendVerificationEmail(user, verificationToken);

    res.json({
      msg: "User registered successfully. Please check your email to verify your account.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Registration msg:", error);
    res.status(500).json({ msg: "Registration failed" });
  }
});

// --- EMAIL VERIFICATION ROUTE ---
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ msg: "Verification token required" });
    }

    // Find verification token
    const verification = await EmailVerification.findOne({ token });
    if (!verification) {
      return res.status(400).json({ msg: "Invalid verification token" });
    }

    if (verification.expires < new Date()) {
      await EmailVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({ msg: "Verification token expired" });
    }

    // Update user
    const user = await User.findByIdAndUpdate(verification.userId, {
      isEmailVerified: true,
    });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Delete verification token
    await EmailVerification.deleteOne({ _id: verification._id });

    // Generate tokens
    const tokens = await generateTokens(user);

    res.json({
      msg: "Email verified successfully",
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Email verification msg:", error);
    res.status(500).json({ msg: "Email verification failed" });
  }
});

// --- RESEND VERIFICATION EMAIL ROUTE ---
router.post("/resend-verification", emailLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: "Email is already verified" });
    }

    // Delete existing verification tokens
    await EmailVerification.deleteMany({ userId: user._id });

    // Generate new verification token
    const verificationToken = uuidv4();

    await EmailVerification.create({
      userId: user._id,
      token: verificationToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
    });

    await sendVerificationEmail(user, verificationToken);

    res.json({ msg: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification msg:", error);
    res.status(500).json({ msg: "Failed to send verification email" });
  }
});

// --- LOGIN WITH EMAIL/PASSWORD ROUTE ---
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.authMethod !== "email") {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        msg: "Account is temporarily locked due to too many failed attempts",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ msg: "Account is deactivated" });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      await user.incLoginAttempts();
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        msg: "Please verify your email before logging in",
        needsEmailVerification: true,
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokens = await generateTokens(user);

    res.json({
      msg: "Login successful",
      ...tokens,
      user: {
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        avatar: user.avatar,
        authMethod: user.authMethod,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login msg:", error);
    res.status(500).json({ msg: "Login failed" });
  }
});

// --- GOOGLE OAUTH LOGIN ROUTE ---
router.post("/auth/google", async (req, res) => {
  try {
    const { credential, role } = req.body;

    if (!credential || !role) {
      return res
        .status(400)
        .json({ msg: "Google credential and role are required", email: "" });
    }

    // check if role is 'designer' or 'registered'
    if (!["designer", "registered"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role", email: "" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, email_verified } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        role,
        avatar:
          payload.picture || "http://localhost:5173/uploads/default-avatar.svg",
        authMethod: "google",
        isEmailVerified: email_verified,
      });
    } else if (user.authMethod !== "google") {
      return res.status(400).json({
        msg: "Email is already registered with email/password. Please login with your password.",
        email,
      });
    } else {
      // Update last login
      user.lastLogin = new Date();
      await user.save();
    }

    const tokens = await generateTokens(user);

    res.json({
      msg: "Google login successful",
      ...tokens,
      user: {
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        avatar: user.avatar,
        authMethod: user.authMethod,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google auth msg:", error);
    res.status(500).json({ msg: "Google authentication failed", email: "" });
  }
});

// --- REFRESH TOKEN ROUTE ---
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token required" });
    }
    const tokenDoc = await RefreshToken.findOne({
      token: refreshToken,
      isActive: true,
    });
    if (!tokenDoc) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const decoded = verifyToken(refreshToken, config.JWT_REFRESH_SECRET);
    if (!decoded) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      await RefreshToken.deleteOne({ token: refreshToken });
      return res.status(403).json({ msg: "User not found" });
    }

    // Remove old refresh token and generate new tokens
    await RefreshToken.deleteOne({ token: refreshToken });
    const tokens = generateTokens(user.email, user.email, user.isEmailVerified);

    res.json({
      msg: "Token refreshed successfully",
      ...tokens,
    });
  } catch (error) {
    console.error("Refresh token msg:", error);
    res.status(500).json({ msg: "Failed to refresh token" });
  }
});

// --- FORGOT PASSWORD ROUTE ---
router.post("/forgot-password", emailLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // check if user is registered via email
    if (user.authMethod !== "email") {
      return res.status(400).json({
        msg: "Email is not registered via email/password.",
      });
    }
    // Generate verification token
    const verificationToken = uuidv4();

    // Store verification token
    await EmailVerification.create({
      userId: user._id,
      token: verificationToken,
      expires: new Date(Date.now() + 3600000), // 1 hour
    });

    await sendPasswordResetEmail(user, verificationToken);

    res.json({ msg: "Password reset email sent" });
  } catch (error) {
    console.error("Send reset password email msg:", error);
    res.status(500).json({ msg: "Failed to send reset password email" });
  }
});

// --- RESET PASSWORD ROUTE ---
router.post("/reset-password", async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  try {
    // Find verification token
    const verification = await EmailVerification.findOne({ token });

    // get user by verification token
    const user = await User.findById(verification?.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!verification) {
      return res.status(400).json({ msg: "Invalid verification token" });
    }

    if (verification.expires < new Date()) {
      await EmailVerification.deleteOne({ _id: verification._id });
      return res.status(400).json({ msg: "Verification token expired" });
    }

    // delete verification token
    await EmailVerification.deleteOne({ _id: verification._id });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset password msg:", error);
    res.status(500).json({ msg: "Failed to reset password" });
  }
});

// --- GET USER PROFILE ROUTE ---
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({
      email: user.email,
      name: user.name,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
      avatar: user.avatar,
      authMethod: user.authMethod,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile msg:", error);
    res.status(500).json({ msg: "Failed to get profile" });
  }
});

// --- LOGOUT ROUTE ---
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }

    res.json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Logout msg:", error);
    res.status(500).json({ msg: "Logout failed" });
  }
});

// --- GET ALL USERS ---
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- UPGRADE TO PREMIUM ROUTE ---
router.put("/upgrade-to-premium", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (user.role !== "registered") {
      return res
        .status(400)
        .json({ msg: "Only registered users can upgrade." });
    }
    user.role = "premium";
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role, // This will now be 'premium'
        name: user.name,
        avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.id}`,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("UPGRADE msg:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
