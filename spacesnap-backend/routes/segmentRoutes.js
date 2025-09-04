// routes/segmentRoutes.js
const express = require("express");
const multer = require("multer");
const fetch = require("node-fetch"); // v2 CommonJS
const { Buffer } = require("buffer");
const { Blob: NodeBlob } = require("buffer"); // fallback if global Blob is missing

const router = express.Router();

// Your public Space (no token needed)
const SPACE_ID_OR_URL =
  process.env.GRADIO_SPACE_SEGMENT || "awmsafras/roomsegmentaion";

// Multer: in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// Convert a remote URL to a data URL so the FE can render without CORS
async function toDataUrl(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed (${r.status})`);
  const ab = await r.arrayBuffer();
  const mime = r.headers.get("content-type") || "image/png";
  const b64 = Buffer.from(ab).toString("base64");
  return `data:${mime};base64,${b64}`;
}

/**
 * POST /api/segment
 * form-data: image=<file>
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file)
      return res.status(400).json({ error: "image (file) is required" });

    console.log("Processing file:", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    // Prepare a Blob for Gradio (works with gr.Image(type="pil"))
    const BlobCtor = typeof Blob !== "undefined" ? Blob : NodeBlob;
    const blob = new BlobCtor([file.buffer], {
      type: file.mimetype || "image/png",
    });

    // Gradio client
    const { Client } = await import("@gradio/client");
    const client = await Client.connect(SPACE_ID_OR_URL);

    // Find an endpoint; default to /predict
    const api = await client.view_api();
    let endpoint = "/predict";
    if (api?.named_endpoints && Object.keys(api.named_endpoints).length > 0) {
      // pick the first named endpoint
      endpoint = Object.keys(api.named_endpoints)[0];
    } else if (Array.isArray(api) && api[0]?.endpoint) {
      endpoint = api[0].endpoint;
    }
    console.log("Using Gradio endpoint:", endpoint);

    // Predict with the Blob (no client.upload!)
    const result = await client.predict(endpoint, [blob]);
    console.log("Gradio client raw result:", result);

    // Normalize output → data URL for frontend
    let resultImageUrl = null;
    const payload = result?.data ?? result;
    const first = Array.isArray(payload) ? payload[0] : payload;

    if (typeof first === "string" && first.startsWith("data:image/")) {
      resultImageUrl = first;
    } else if (first?.url) {
      resultImageUrl = await toDataUrl(first.url);
    } else if (
      first?.data &&
      typeof first.data === "string" &&
      first.data.startsWith("data:image/")
    ) {
      resultImageUrl = first.data;
    } else if (first?.path) {
      // If Space returns a file path
      const baseUrl = `https://huggingface.co/spaces/${SPACE_ID_OR_URL}`;
      const fullUrl = `${baseUrl}/file=${first.path}`;
      resultImageUrl = await toDataUrl(fullUrl);
    }

    if (!resultImageUrl) {
      console.error("No valid image found in result:", {
        result,
        payload,
        first,
      });
      return res.status(502).json({
        error: "No image returned from Gradio Space",
        debug: { result, payload, first },
      });
    }

    return res.json({
      resultImageUrl,
      wallMaskUrl: null,
      floorMaskUrl: null,
      ceilingMaskUrl: null,
    });
  } catch (err) {
    console.error("SEGMENT ERROR:", err);
    let errorDetail = err?.message || String(err);
    if (err?.response?.data) {
      errorDetail += ` | Response: ${JSON.stringify(err.response.data)}`;
    }
    if (err?.stack) {
      console.error("Stack trace:", err.stack);
    }
    return res.status(500).json({
      error: "Segmentation failed",
      detail: errorDetail,
    });
  }
});

module.exports = router;
