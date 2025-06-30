// src/data/designData.js

// --- FINAL, CORRECTED LOCAL IMAGE IMPORTS ---
// This code now imports every image from its exact location and with its correct name and extension.
// There are NO sub-folders in the paths.
import ceilingFanImg from '../assets/images/celling-fan.jpg';    // Corrected spelling and path
import darkWoodPattern from '../assets/images/dark-wood.jpg';    // Corrected path
import lightWoodPattern from '../assets/images/light-wood.jpg';   // Corrected path
import marbleTilePattern from '../assets/images/marble-tile.jpg'; // Corrected path
import paintingImg from '../assets/images/painting.jpg';         // Corrected path
import pendantLightImg from '../assets/images/pendant-light.jpg';  // Corrected path
import plantImg from '../assets/images/plant.jpg';               // Corrected path
import sofaImg from '../assets/images/sofa.webp';                // Corrected path and extension
import wallClockImg from '../assets/images/wall-clock.jpg';        // Corrected path


// --- WALLS ---
export const wallColorPalettes = {
    modern: ['#FFFFFF', '#2F3B4E', '#8D93A1', '#EAEAEA'],
    minimalist: ['#F5F5F5', '#DDDDDD', '#333333', '#A9A9A9'],
    bohemian: ['#DCC9B6', '#6B7A6A', '#C87D5A', '#F2E4D5'],
    industrial: ['#424242', '#BDBDBD', '#757575', '#CF5C36'],
    default: ['#FFFFFF', '#F0F0F0', '#CCCCCC', '#AAAAAA'],
};

// --- CEILINGS ---
export const ceilingColorPalettes = {
    default: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#DCDCDC'],
};

// --- FLOORS (Now using the correct imported images) ---
export const floorPatterns = [
    { id: 'floor01', name: 'Light Wood', image: lightWoodPattern },
    { id: 'floor02', name: 'Dark Wood', image: darkWoodPattern },
    { id: 'floor03', name: 'Marble Tile', image: marbleTilePattern },
];

// --- PLACEABLE OBJECTS (Now using the correct imported images) ---
export const placeableObjects = {
    wall: [
        { id: 'obj_wall_01', name: 'Modern Wall Clock', image: wallClockImg, width: 100, height: 100 },
        { id: 'obj_wall_02', name: 'Abstract Painting', image: paintingImg, width: 150, height: 120 },
    ],
    floor: [
        { id: 'obj_floor_01', name: 'Sleek Sofa', image: sofaImg, width: 300, height: 150 },
        { id: 'obj_floor_02', name: 'House Plant', image: plantImg, width: 80, height: 120 },
    ],
    ceiling: [
        { id: 'obj_ceil_01', name: 'Ceiling Fan', image: ceilingFanImg, width: 150, height: 70 },
        { id: 'obj_ceil_02', name: 'Pendant Light', image: pendantLightImg, width: 80, height: 100 },
    ],
};