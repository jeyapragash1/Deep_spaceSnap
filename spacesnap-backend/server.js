// spacesnap-backend/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const connectDB = require("./config/db");

// --- Route Imports ---
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizRoutes = require("./routes/quizRoutes");
const debugQuizRoutes = require("./routes/debugQuizRoutes");
const imageRoutes = require("./routes/imageRoutes");
const consultationRoutes = require("./routes/consultations");
const designRoutes = require("./routes/designs");
const paymentRoutes = require("./routes/paymentRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes"); // <-- IMPORT NEW ROUTE
const roomVisualizeRoute = require("./routes/roomVisualizeRoute");
const segmentRoutes = require("./routes/segmentRoutes");

const startServer = async () => {
  // Connect to the database first
  await connectDB();

  const app = express();

  // --- Middleware ---
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));

  // --- API Routes ---
  app.get("/", (req, res) => res.send("API is running..."));

  // Mount all the different route handlers
  app.use("/api/users", userRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/quiz", quizRoutes);
  app.use("/api/debug", debugQuizRoutes);
  app.use("/api/images", imageRoutes);
  app.use("/api/consultations", consultationRoutes);
  app.use("/api/designs", designRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/portfolio", portfolioRoutes); // <-- USE NEW ROUTE
  app.use("/api/room-visualize", roomVisualizeRoute);
  app.use("/api/segment", segmentRoutes);

  // --- Server Initialization ---
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server is listening on port ${PORT}`));
};

// Start the server
startServer();
