// src/services/aiVisualizerService.js

// This MOCK service now provides more detailed segmentation masks.
// In a real app, a sophisticated AI model would generate these paths.

const segmentRoom = async (imageFile) => {
  console.log("Mock AI: Starting advanced room segmentation (walls, floor, ceiling)...");
  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log("Mock AI: Analysis complete. Returning detailed masks.");
  
  // FAKE result with more detail. These SVG paths represent different areas.
  return {
    wallMask: "M0 100 L0 500 L300 450 L700 450 L800 550 L800 150 Z",
    floorMask: "M0 500 L300 450 L700 450 L800 550 L800 600 L0 600 Z",
    ceilingMask: "M0 100 L800 150 L800 0 L0 0 Z",
  };
};

const aiVisualizerService = {
  segmentRoom,
};

export default aiVisualizerService;