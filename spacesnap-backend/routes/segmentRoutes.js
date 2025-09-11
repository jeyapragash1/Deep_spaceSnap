const express = require("express");
const multer = require("multer");

const router = express.Router();

// Multer: in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file)
      return res.status(400).json({ error: "image (file) is required" });

    console.log("Fallback server processing for file:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    const base64 = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;

    return res.json({
      resultImageUrl: dataUrl,
      wallMaskUrl: null,
      floorMaskUrl: null,
      ceilingMaskUrl: null,
      message: "Processed with fallback - use Gemini Nano for analysis"
    });

  } catch (err) {
    console.error("SEGMENT FALLBACK ERROR:", err);
    return res.status(500).json({
      error: "Segmentation fallback failed",
      detail: err?.message || String(err),
    });
  }
});

module.exports = router;
