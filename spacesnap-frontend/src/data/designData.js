// src/data/designData.js

const imageSource = 'https://plus.unsplash.com/premium_photo-1678559109912-61ab7424a548';

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

// --- FLOORS (Using repeating background images for tiles) ---
export const floorPatterns = [
    { id: 'floor01', name: 'Light Wood', image: 'https://www.toptal.com/designers/subtlepatterns/uploads/light-veneer.png' },
    { id: 'floor02', name: 'Dark Wood', image: 'https://www.toptal.com/designers/subtlepatterns/uploads/dark-wood.png' },
    { id: 'floor03', name: 'Marble Tile', image: 'https://www.toptal.com/designers/subtlepatterns/uploads/marbel.png' },
    { id: 'floor04', name: 'Gray Concrete', image: 'https://www.toptal.com/designers/subtlepatterns/uploads/concrete-wall.png' },
];

// --- PLACEABLE OBJECTS (Using transparent PNGs) ---
// We categorize them for better organization in the UI.
export const placeableObjects = {
    wall: [
        { id: 'obj_wall_01', name: 'Modern Wall Clock', image: 'https://www.pngmart.com/files/15/Modern-Wall-Clock-PNG-Image.png', width: 100, height: 100 },
        { id: 'obj_wall_02', name: 'Abstract Painting', image: 'https://www.pngmart.com/files/22/Abstract-Painting-PNG-Isolated-Pic.png', width: 150, height: 120 },
        { id: 'obj_wall_03', name: 'Wall Shelf', image: 'https://www.pngmart.com/files/15/Wall-Shelf-PNG-Image.png', width: 200, height: 50 },
    ],
    floor: [
        { id: 'obj_floor_01', name: 'Sleek Sofa', image: 'https://www.pngmart.com/files/7/Sofa-PNG-Transparent-Image.png', width: 300, height: 150 },
        { id: 'obj_floor_02', name: 'House Plant', image: 'https://www.pngmart.com/files/15/House-Plant-PNG-Image.png', width: 80, height: 120 },
        { id: 'obj_floor_03', name: 'Floor Lamp', image: 'https://www.pngmart.com/files/15/Floor-Lamp-PNG-Clipart.png', width: 60, height: 180 },
    ],
    ceiling: [
        { id: 'obj_ceil_01', name: 'Ceiling Fan', image: 'https://www.pngmart.com/files/22/Ceiling-Fan-PNG-HD.png', width: 150, height: 70 },
        { id: 'obj_ceil_02', name: 'Pendant Light', image: 'https://www.pngmart.com/files/22/Pendant-Light-PNG-File.png', width: 80, height: 100 },
    ],
};