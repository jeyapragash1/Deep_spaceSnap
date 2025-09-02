// services/aiVisualizerService.js
import axios from "axios";

const SEGMENT_API_URL = "http://localhost:5000/api/segment";

function filenameFromBlob(blob, fallback = "room.png") {
  const type = blob?.type || "";
  if (type.includes("jpeg")) return "room.jpg";
  if (type.includes("png")) return "room.png";
  if (type.includes("webp")) return "room.webp";
  if (type.includes("gif")) return "room.gif";
  return fallback;
}

export async function segmentRoom(imageSource) {
  let fileBlob;

  // Blob/File passed in directly
  if (imageSource instanceof Blob || imageSource instanceof File) {
    fileBlob = imageSource;
  }
  // data URL string → Blob
  else if (typeof imageSource === "string") {
    const r = await fetch(imageSource);
    fileBlob = await r.blob();
  } else {
    throw new Error("Unsupported image source");
  }

  const form = new FormData();
  form.append("image", fileBlob, filenameFromBlob(fileBlob));

  try {
    const { data } = await axios.post(SEGMENT_API_URL, form /* no headers */);
    return {
      resultImageUrl: data?.resultImageUrl ?? null,
      wallMaskUrl: data?.wallMaskUrl ?? null,
      floorMaskUrl: data?.floorMaskUrl ?? null,
      ceilingMaskUrl: data?.ceilingMaskUrl ?? null,
    };
  } catch (err) {
    // surface backend error message if present
    const detail =
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      "Unknown error";
    throw new Error(`Segmentation failed: ${detail}`);
  }
}

export default { segmentRoom };
