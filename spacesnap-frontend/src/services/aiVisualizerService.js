// src/services/aiVisualizerService.js

// Mock segmentation service returning SVG path masks.
// Replace with your real API call when ready.
const segmentRoom = async (imageFileOrUrl) => {
  console.log(
    "Mock AI: Starting advanced room segmentation for:",
    imageFileOrUrl
  );
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("Mock AI: Analysis complete. Returning detailed masks.");

  // SVG path masks sized for a nominal 800x600 viewBox.
  return {
    wallMask: "M0 100 L0 500 L300 450 L700 450 L800 550 L800 150 Z",
    floorMask: "M0 500 L300 450 L700 450 L800 550 L800 600 L0 600 Z",
    ceilingMask: "M0 100 L800 150 L800 0 L0 0 Z",
  };
};

const aiVisualizerService = { segmentRoom };
export default aiVisualizerService;
