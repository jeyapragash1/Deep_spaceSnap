// // src/data/portfolioData.js

// // --- We import your local images ---
// import img1 from '../assets/images/portfolio/1.png';
// import img2 from "../assets/images/portfolio/2.png";
// import img3 from "../assets/images/portfolio/3.png";
// import img4 from "../assets/images/portfolio/4.png";
// import img5 from "../assets/images/portfolio/5.png";
// import img6 from "../assets/images/portfolio/6.png";
// import img7 from "../assets/images/portfolio/7.png";
// import img8 from "../assets/images/portfolio/8.png";
// import img9 from "../assets/images/portfolio/9.png";
// import img10 from "../assets/images/portfolio/10.png";
// import img11 from "../assets/images/portfolio/11.png";
// import img12 from "../assets/images/portfolio/12.png";
// import img13 from "../assets/images/portfolio/13.png";
// import img14 from "../assets/images/portfolio/14.png";
// import img15 from "../assets/images/portfolio/15.png";
// import img16 from "../assets/images/portfolio/16.png";
// import img17 from "../assets/images/portfolio/17.png";
// import img18 from "../assets/images/portfolio/18.png";
// import img19 from "../assets/images/portfolio/19.png";
// import img20 from "../assets/images/portfolio/20.png";
// import img21 from "../assets/images/portfolio/21.png";
// import img22 from "../assets/images/portfolio/22.png";
// import img23 from "../assets/images/portfolio/23.png";
// import img24 from "../assets/images/portfolio/24.png";
// import img25 from "../assets/images/portfolio/25.png";
// import img26 from "../assets/images/portfolio/26.png";
// import img27 from "../assets/images/portfolio/27.png";
// import img28 from "../assets/images/portfolio/28.png";
// import img29 from "../assets/images/portfolio/29.png";
// import img30 from "../assets/images/portfolio/30.png";

// // --- FILTER CATEGORIES (No changes needed) ---
// export const portfolioCategories = [
//     'All', 'Modern', 'Bohemian', 'Minimalist', 'Industrial', 'Rustic', 'Scandinavian', 'Eclectic'
// ];


//     { id: 7, image: img7, title: 'Monochrome Modern Kitchen', designer: 'Elena Romanova', style: 'modern', description: 'Sleek + functional.', details: ['Matte Black Cabinets', 'Quartz Countertops'] },
//     { id: 8, image: img8, title: 'Vibrant Eclectic Lounge', designer: 'John Davis', style: 'eclectic', description: 'Personality overload (in a good way).', details: ['Velvet Sofa', 'Gallery Wall'] },
//     { id: 9, image: img9, title: 'Natural Light Bohemian', designer: 'Leo Carter', style: 'bohemian', description: 'Sunlight + soft fabrics = peace.', details: ['Large Windows', 'Linen Curtains'] },
//     { id: 10, image: img10, title: 'Clean Lines Office', designer: 'Elena Romanova', style: 'minimalist', description: 'Focus. Flow. Finish your to-do list.', details: ['Minimalist Desk', 'Hidden Storage'] },
//     { id: 11, image: img11, title: 'Modern Simplicity', designer: 'Anya Sharma', style: 'modern', description: 'Pure and elegant.', details: ['Geometric Rug', 'Abstract Art'] },
//     { id: 12, image: img12, title: 'Rustic Charm Bedroom', designer: 'John Davis', style: 'rustic', description: 'Sleep in timeless style.', details: ['Barn Door', 'Knit Throw Blanket'] },
//     { id: 13, image: img13, title: 'Soft Boho Living', designer: 'Maya Lin', style: 'bohemian', description: 'Delicate tones and soft textures.', details: ['Boho Throw Pillows', 'Soft Wool Carpet'] },
//     { id: 14, image: img14, title: 'Bold Industrial Kitchen', designer: 'Oscar Lee', style: 'industrial', description: 'Where grit meets gourmet.', details: ['Iron Shelves', 'Concrete Island'] },
//     { id: 15, image: img15, title: 'Nordic Winter Living Room', designer: 'Freya Johansen', style: 'scandinavian', description: 'Stay cozy all year long.', details: ['White Washed Walls', 'Woolen Blankets'] },
//     { id: 16, image: img16, title: 'Zen Minimal Bathroom', designer: 'Yuki Tanaka', style: 'minimalist', description: 'Less clutter, more calm.', details: ['Stone Basin Sink', 'Hidden Cabinets'] },
//     { id: 17, image: img17, title: 'Cottagecore Rustic Kitchen', designer: 'Emma Rose', style: 'rustic', description: 'Farmhouse energy, Pinterest approved.', details: ['Open Pantry', 'Wooden Countertops'] },
//     { id: 18, image: img18, title: 'Modern High-Rise View', designer: 'Anya Sharma', style: 'modern', description: 'A view worth the rent.', details: ['Floor to Ceiling Windows', 'Neutral Palette'] },
//     { id: 19, image: img19, title: 'Gallery-Style Eclectic Space', designer: 'Kai Nguyen', style: 'eclectic', description: 'Organized chaos, with flair.', details: ['Accent Wall', 'Color Pop Accessories'] },
//     { id: 20, image: img20, title: 'Coastal Scandinavian Retreat', designer: 'Freya Johansen', style: 'scandinavian', description: 'Beach meets Nordic chill.', details: ['Driftwood Decor', 'Woven Rugs'] },
//     { id: 21, image: img21, title: 'Urban Jungle Boho Loft', designer: 'Leo Carter', style: 'bohemian', description: 'Plants. More plants.', details: ['Hanging Planters', 'Earthy Tones'] },
//     { id: 22, image: img22, title: 'Steel + Stone Office', designer: 'Oscar Lee', style: 'industrial', description: 'Work hard. Look good doing it.', details: ['Steel Fixtures', 'Stone Accents'] },
//     { id: 23, image: img23, title: 'Neutral Minimal Bedroom', designer: 'Elena Romanova', style: 'minimalist', description: 'Just enough for a clear mind.', details: ['Low Platform Bed', 'Single Art Frame'] },
//     { id: 24, image: img24, title: 'Modern Glam Dining', designer: 'Anya Sharma', style: 'modern', description: 'A dinner party stunner.', details: ['Gold Accents', 'Velvet Chairs'] },
//     { id: 25, image: img25, title: 'Mountain Cabin Rustic', designer: 'John Davis', style: 'rustic', description: 'Wood, stone, and warm blankets.', details: ['Fireplace Centerpiece', 'Antique Decor'] },
//     { id: 26, image: img26, title: 'Bright Scandinavian Kitchen', designer: 'Freya Johansen', style: 'scandinavian', description: 'Functional but cute af.', details: ['White Cabinets', 'Natural Wood'] },
//     { id: 27, image: img27, title: 'Maximalist Eclectic Explosion', designer: 'Kai Nguyen', style: 'eclectic', description: 'Bold prints and bright colors.', details: ['Mixed Patterns', 'Layered Textures'] },
//     { id: 28, image: img28, title: 'Modern Tech Loft', designer: 'Oscar Lee', style: 'modern', description: 'Smart home vibes.', details: ['Smart Lighting', 'Touchscreen Controls'] },
//     { id: 29, image: img29, title: 'Sleek Minimal Kitchen', designer: 'Yuki Tanaka', style: 'minimalist', description: 'Tidy, sharp, beautiful.', details: ['Hidden Appliances', 'Matte Surfaces'] },
//     { id: 30, image: img30, title: 'Boho Outdoor Oasis', designer: 'Emma Rose', style: 'bohemian', description: 'Chill under the stars.', details: ['Rattan Swing Chair', 'String Lights'] },
// ];