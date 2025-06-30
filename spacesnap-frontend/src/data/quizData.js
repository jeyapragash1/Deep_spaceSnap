// src/data/quizData.js

// We'll use direct URLs from Unsplash (a free-to-use image site) to make this work instantly.
// For a final product, you would download these and put them in your assets folder.

export const quizQuestions = [
  // Question 1: Visual Palette
  {
    question: "Which of these color palettes feels most like you?",
    type: 'image',
    answers: [
      { text: "Calm & Neutral", image: 'https://images.unsplash.com/photo-154179579-09dba4287402?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { modern: 3, minimalist: 2 }, trait: 'prefers a clean, uncluttered look' },
      { text: "Warm & Earthy", image: 'https://images.unsplash.com/photo-1595604134739-0b7a0d0d8c0d?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { bohemian: 3, rustic: 2 }, trait: 'is drawn to natural, organic materials' },
      { text: "Bold & Colorful", image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { eclectic: 3, maximalist: 2 }, trait: 'loves to express personality through color' },
      { text: "Light & Serene", image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02a4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { scandinavian: 3, coastal: 2 }, trait: 'enjoys bright and airy spaces' },
    ],
  },
  // Question 2: Lifestyle
  {
    question: "A perfect evening at home is...",
    type: 'text',
    answers: [
      { text: "Hosting a dinner party with great conversation.", stylePoints: { contemporary: 2, glamorous: 2 }, trait: 'enjoys social and entertaining spaces' },
      { text: "Curled up with a good book and a warm blanket.", stylePoints: { bohemian: 2, traditional: 1 }, trait: 'values comfort and coziness' },
      { text: "Organizing and tidying up my space for peace of mind.", stylePoints: { minimalist: 3, modern: 1 }, trait: 'thrives in an orderly environment' },
      { text: "Getting lost in a creative hobby or project.", stylePoints: { eclectic: 2, industrial: 1 }, trait: 'needs a space that inspires creativity' },
    ],
  },
  // Question 3: Furniture Style
  {
    question: "Which sofa would you choose?",
    type: 'image',
    answers: [
      { text: "Sleek & Low-Profile", image: 'https://images.unsplash.com/photo-1540574163784-554f495afa38?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { modern: 3, minimalist: 2 } },
      { text: "Plush & Comfortable", image: 'https://images.unsplash.com/photo-1618220252344-88b9a1895641?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { bohemian: 2, traditional: 2 } },
      { text: "A Unique Statement Piece", image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { eclectic: 3, vintage: 2 } },
      { text: "Simple & Functional", image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { scandinavian: 3, industrial: 2 } },
    ],
  },
  // Question 4: Vibe
  {
    question: "Which room makes you feel most at ease?",
    type: 'image',
    answers: [
      { text: "An open, light-filled loft.", image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { industrial: 3, minimalist: 2 } },
      { text: "A room full of plants and personal treasures.", image: 'https://images.unsplash.com/photo-1592166411429-c1b85a119777?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { bohemian: 3, eclectic: 2 } },
      { text: "A perfectly balanced and elegant space.", image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { traditional: 3, contemporary: 2 } },
      { text: "A simple, cozy, and functional room.", image: 'https://images.unsplash.com/photo-1594454903933-f1559a6a8a3a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy', stylePoints: { scandinavian: 3, modern: 1 } },
    ],
  },
  // Question 5: Material Preference
  {
    question: "Which material do you prefer to have in your home?",
    type: 'text',
    answers: [
      { text: "Sleek metal and glass.", stylePoints: { modern: 2, industrial: 2 }, trait: 'likes cool, man-made materials' },
      { text: "Natural wood and woven fabrics.", stylePoints: { bohemian: 2, rustic: 3 }, trait: 'is drawn to natural, organic materials' },
      { text: "Luxurious velvet and polished marble.", stylePoints: { glamorous: 3, contemporary: 1 }, trait: 'appreciates a touch of luxury' },
      { text: "A mix of everything - whatever looks good!", stylePoints: { eclectic: 3 }, trait: 'enjoys variety and contrast' },
    ],
  },
  // Add 3-5 more questions following these patterns...
];

// --- RICH STYLE DATA FOR RESULTS PAGE ---
export const styles = {
    modern: { 
        name: "Modern", 
        description: "You appreciate simplicity and sophistication. Modern design is all about clean lines, simple color palettes, and the use of materials like metal, glass, and steel. It’s an uncluttered style where form follows function.",
        heroImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
        keyElements: ["Neutral Colors", "Clean Lines", "Uncluttered Spaces", "Metal & Glass Accents"],
        galleryImages: [
            'https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1556702585-528574445237?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1617103996223-356a1b256606?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy'
        ]
    },
    bohemian: { 
        name: "Bohemian (Boho)", 
        description: "You are a free spirit with a love for art and culture. The Bohemian style reflects a carefree and unconventional life. It's characterized by a mix of patterns, textures, and colors, with a focus on natural materials and personal treasures.",
        heroImage: 'https://images.unsplash.com/photo-1585435465945-59b3a74939de?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
        keyElements: ["Rich Patterns", "Houseplants", "Layered Textures", "Natural Materials (Wood, Rattan)"],
        galleryImages: [
            'https://images.unsplash.com/photo-1567684015259-8a036496984e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1590928014266-de438d17a14c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1555624459-39f65028716e?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy'
        ]
    },
    minimalist: {
        name: "Minimalist",
        description: "You believe that less is more. Minimalist design is about stripping things down to their essential quality to achieve simplicity. The look is clean, uncluttered, and serene, focusing on space, light, and form.",
        heroImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
        keyElements: ["Monochromatic Palette", "Empty Space", "Lack of Ornamentation", "Simple Forms"],
        galleryImages: [
            'https://images.unsplash.com/photo-1562664377-709f2c337eb1?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy'
        ]
    },
    eclectic: {
        name: "Eclectic",
        description: "You are a creative soul who doesn't like to play by the rules. Eclectic design is a harmonious mix of different styles, eras, and textures. It’s a curated look that pulls together diverse elements to create something unique and personal.",
        heroImage: 'https://images.unsplash.com/photo-1551291835-24070d621b44?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
        keyElements: ["High-Contrast Mixes", "Unexpected Elements", "Variety of Textures", "Personalized Art & Decor"],
        galleryImages: [
            'https://images.unsplash.com/photo-1567016432779-1fee7462333b?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1580043521252-088a0740330a?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy',
            'https://images.unsplash.com/photo-1534599184568-7a5b3a42c43c?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy'
        ]
    },
    // Add more styles like 'industrial', 'scandinavian', 'traditional' here...
};