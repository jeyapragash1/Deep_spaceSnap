// src/services/aiVisualizerService.js
import axios from "axios";

// ✅ set your full backend URL here
const SEGMENT_API_URL = "http://localhost:5000/api/segment";

async function segmentRoom(imageUrl) {
  const res = await axios.post(SEGMENT_API_URL, { imageUrl });
  return {
    wallMaskUrl: res.data?.wallMaskUrl ?? null,
    floorMaskUrl: res.data?.floorMaskUrl ?? null,
    ceilingMaskUrl: res.data?.ceilingMaskUrl ?? null,
  };
}

export default { segmentRoom };
