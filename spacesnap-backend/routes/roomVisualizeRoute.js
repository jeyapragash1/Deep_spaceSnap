const express = require("express");
const multer = require("multer");
const { Blob } = require("buffer");

const router = express.Router();

// Multer: in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// POST /api/room-visualize/upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;

    if (!file || !prompt) {
      return res
        .status(400)
        .json({ error: "image (file) and prompt are required" });
    }

    // Convert Buffer -> Blob for @gradio/client
    const imageBlob = new Blob([file.buffer], {
      type: file.mimetype || "image/png",
    });

    // @gradio/client is ESM; use dynamic import in CommonJS
    const { Client } = await import("@gradio/client");

    // If your Space ID or endpoint differ, I don't know — update these two values.
    const client = await Client.connect("awmsafras/gradio-project");

    const result = await client.predict("/predict", {
      input_image: imageBlob, // change key if your Space expects a different name
      prompt,
    });

    const imgSrc = result?.data?.[0]?.url;
    if (!imgSrc) {
      return res
        .status(502)
        .json({ error: "No image URL returned from model" });
    }

    return res.json({ image: imgSrc });
  } catch (err) {
    console.error("Generation error (upload):", err);
    return res
      .status(500)
      .json({ error: err?.message || "Image generation failed" });
  }
});

module.exports = router;
