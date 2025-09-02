// routes/segment.js
const express = require("express");
const fetch = require("node-fetch"); // v2 (require) is fine
const router = express.Router();

const GRADIO_SPACE_SEGMENT = process.env.GRADIO_SPACE_SEGMENT; // e.g. "https://your-space.hf.space/"

function dataUrlToBlob(dataUrl) {
  // data:[<mime>][;base64],<data>
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Invalid data URL");
  const mime = match[1];
  const b64 = match[2];
  const buf = Buffer.from(b64, "base64");
  return new Blob([buf], { type: mime });
}

router.post("/", async (req, res) => {
  try {
    const { imageUrl } = req.body || {};
    if (!imageUrl)
      return res.status(400).json({ error: "imageUrl is required" });
    if (!GRADIO_SPACE_SEGMENT) {
      return res.status(500).json({ error: "Missing GRADIO_SPACE_SEGMENT" });
    }

    // ESM-only package; dynamic import works under CommonJS
    const { Client } = await import("@gradio/client");

    let inputBlob;

    if (/^data:image\//i.test(imageUrl)) {
      // Handle base64 data URLs from <input type="file"> readers, canvases, etc.
      inputBlob = dataUrlToBlob(imageUrl);
    } else if (/^https?:\/\//i.test(imageUrl)) {
      // Remote image – fetch and wrap as Blob
      const r = await fetch(imageUrl);
      if (!r.ok)
        return res
          .status(400)
          .json({ error: `Failed to fetch imageUrl (${r.status})` });
      const ab = await r.arrayBuffer();
      const ct = r.headers.get("content-type") || "application/octet-stream";
      inputBlob = new Blob([ab], { type: ct });
    } else {
      return res.status(400).json({
        error:
          "Unsupported imageUrl. Provide http(s) URL or data:image/*;base64,...",
      });
    }

    // Connect to your Space and call the Interface endpoint.
    const client = await Client.connect(GRADIO_SPACE_SEGMENT);

    // Your Space has a single Image input; pass a single Blob in the same order.
    // Default Interface endpoint is "/predict".
    const result = await client.predict("/predict", [inputBlob]);

    // Gradio may return { data: {...} } or { data: [ {...} ] }
    let payload = result?.data ?? result;
    if (Array.isArray(payload)) payload = payload[0];

    // Your Space returns keys: wallMaskUrl, floorMaskUrl, ceilingMaskUrl
    return res.json({
      wallMaskUrl: payload?.wallMaskUrl ?? null,
      floorMaskUrl: payload?.floorMaskUrl ?? null,
      ceilingMaskUrl: payload?.ceilingMaskUrl ?? null,
    });
  } catch (err) {
    console.error("SEGMENT ERROR:", err);
    return res
      .status(500)
      .json({ error: err?.message || "Segmentation failed" });
  }
});

module.exports = router;
