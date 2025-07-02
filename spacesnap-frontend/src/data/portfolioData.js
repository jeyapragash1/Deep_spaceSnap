// src/data/portfolioData.js

// --- LOCAL IMAGE IMPORTS ---
// We import all the images you want to use in the portfolio
import img1 from '../assets/images/1.jpg';
import img2 from '../assets/images/2.jpg';
import img3 from '../assets/images/3.jpg';
import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.jpg';
import img6 from '../assets/images/6.jpg';
import img7 from '../assets/images/7.jpg';
import img8 from '../assets/images/8.jpg';
import img9 from '../assets/images/9.jpg';
import img10 from '../assets/images/10.jpg';
import img11 from '../assets/images/11.jpg';
import img12 from '../assets/images/12.jpg';
import img13 from '../assets/images/13.jpg';
import img14 from '../assets/images/14.jpg';
import img15 from '../assets/images/15.jpg';
import img16 from '../assets/images/16.jpg';
// ... import up to img20 if you have them

// --- PORTFOLIO ITEMS ---
// Each item has an id, an image, a title, a designer, and a style tag for filtering.
export const portfolioItems = [
    { id: 1, image: img1, title: 'Serene Modern Living', designer: 'Anya Sharma', style: 'modern' },
    { id: 2, image: img2, title: 'Earthy Bohemian Bedroom', designer: 'Leo Carter', style: 'bohemian' },
    { id: 3, image: img3, title: 'Minimalist Workspace', designer: 'Elena Romanova', style: 'minimalist' },
    { id: 4, image: img4, title: 'Urban Industrial Loft', designer: 'John Davis', style: 'industrial' },
    { id: 5, image: img5, title: 'Cozy Rustic Corner', designer: 'Leo Carter', style: 'rustic' },
    { id: 6, image: img6, title: 'Chic Scandinavian Dining', designer: 'Anya Sharma', style: 'scandinavian' },
    { id: 7, image: img7, title: 'Monochrome Modern Kitchen', designer: 'Elena Romanova', style: 'modern' },
    { id: 8, image: img8, title: 'Vibrant Eclectic Lounge', designer: 'John Davis', style: 'eclectic' },
    { id: 9, image: img9, title: 'Natural Light Bohemian', designer: 'Leo Carter', style: 'bohemian' },
    { id: 10, image: img10, title: 'Clean Lines Office', designer: 'Elena Romanova', style: 'minimalist' },
    { id: 11, image: img11, title: 'Modern Simplicity', designer: 'Anya Sharma', style: 'modern' },
    { id: 12, image: img12, title: 'Rustic Charm Bedroom', designer: 'John Davis', style: 'rustic' },
    { id: 13, image: img13, title: 'Bohemian Reading Nook', designer: 'Leo Carter', style: 'bohemian' },
    { id: 14, image: img14, title: 'Industrial Kitchen Details', designer: 'John Davis', style: 'industrial' },
    { id: 15, image: img15, title: 'Light & Airy Scandinavian', designer: 'Anya Sharma', style: 'scandinavian' },
    { id: 16, image: img16, title: 'Bold Eclectic Living', designer: 'John Davis', style: 'eclectic' },
];

// --- FILTER CATEGORIES ---
export const portfolioCategories = [
    'All', 'Modern', 'Bohemian', 'Minimalist', 'Industrial', 'Rustic', 'Scandinavian', 'Eclectic'
];