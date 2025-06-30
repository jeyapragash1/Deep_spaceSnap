// src/data/designData.js

const imageSource = 'https://plus.unsplash.com/premium_photo-1678559109912-61ab7424a548';

// Color palettes associated with each style profile
export const colorPalettes = {
    modern: ['#FFFFFF', '#2F3B4E', '#8D93A1', '#EAEAEA'],
    minimalist: ['#F5F5F5', '#DDDDDD', '#333333', '#A9A9A9'],
    bohemian: ['#DCC9B6', '#6B7A6A', '#C87D5A', '#F2E4D5'],
    industrial: ['#424242', '#BDBDBD', '#757575', '#CF5C36'],
    default: ['#FFFFFF', '#F0F0F0', '#CCCCCC', '#AAAAAA'],
};

// Furniture suggestions for each style
export const furnitureSuggestions = {
    modern: [
        { id: 'mf1', name: 'Sleek Sofa', image: 'https://www.pngmart.com/files/7/Sofa-PNG-Transparent-Image.png' },
        { id: 'mf2', name: 'Glass Coffee Table', image: 'https://www.pngmart.com/files/15/Glass-Table-Top-View-PNG.png' },
    ],
    bohemian: [
        { id: 'bf1', name: 'Rattan Chair', image: 'https://www.pngmart.com/files/22/Rattan-Chair-PNG-Isolated-File.png' },
        { id: 'bf2', name: 'Macrame Plant Hanger', image: 'https://www.pngmart.com/files/22/Macrame-Plant-Hanger-PNG-Photo.png' },
    ],
    // Add more furniture for other styles...
    default: [
        { id: 'df1', name: 'Generic Armchair', image: 'https://www.pngmart.com/files/6/Armchair-PNG-Photos.png' }
    ]
};