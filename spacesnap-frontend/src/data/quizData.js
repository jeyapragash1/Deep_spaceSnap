// src/data/quizData.js

const imageSource = 'https://source.unsplash.com/random/800x600?';

export const quizQuestions = {
  // --- The quiz questions from the previous step remain unchanged ---
  'start': {
    question: "First, let's get a feel for your style. Pick an image that you're most drawn to.",
    type: 'image',
    answers: [
      { image: `${imageSource}modern,minimalist,interior`, stylePoints: { modern: 3, minimalist: 2 }, nextQuestion: 'age' },
      { image: `${imageSource}bohemian,livingroom,plants`, stylePoints: { bohemian: 3, rustic: 2 }, nextQuestion: 'age' },
      { image: `${imageSource}classic,elegant,interior`, stylePoints: { traditional: 3, classic: 2 }, nextQuestion: 'age' },
      { image: `${imageSource}industrial,loft,brick,interior`, stylePoints: { industrial: 3, modern: 1 }, nextQuestion: 'age' },
    ],
  },
  // ... all other questions remain here ...
  'age': {
    question: "What is your current age range?",
    type: 'text',
    answers: [
      { text: "Under 25", stylePoints: { student: 3, modern: 1 }, nextQuestion: 'profession_student' },
      { text: "25 - 40", stylePoints: { professional: 3, contemporary: 1 }, nextQuestion: 'profession_professional' },
      { text: "40+", stylePoints: { established: 3, traditional: 1 }, nextQuestion: 'room_purpose' },
    ],
  },
  'profession_student': {
    question: "What's your main goal for this space?",
    type: 'text',
    answers: [
        { text: "A focused study area.", stylePoints: { minimalist: 2, functional: 3 }, nextQuestion: 'room_purpose' },
        { text: "A relaxing space to hang out with friends.", stylePoints: { bohemian: 2, cozy: 3 }, nextQuestion: 'room_purpose' },
        { text: "A creative studio for my hobbies.", stylePoints: { eclectic: 2, creative: 3 }, nextQuestion: 'room_purpose' },
    ]
  },
  'profession_professional': {
    question: "What field do you work in?",
    type: 'text',
    answers: [
      { text: "Tech / Engineering", stylePoints: { modern: 2, tech: 3 }, nextQuestion: 'room_purpose' },
      { text: "Creative / Arts", stylePoints: { eclectic: 2, creative: 3 }, nextQuestion: 'room_purpose' },
      { text: "Business / Finance", stylePoints: { traditional: 2, professional: 2 }, nextQuestion: 'room_purpose' },
      { text: "Other", stylePoints: {}, nextQuestion: 'room_purpose' },
    ]
  },
  'room_purpose': {
    question: "What is the primary function of this room?",
    type: 'text',
    answers: [
      { text: "Living Room - for relaxation and entertainment.", stylePoints: { cozy: 2, contemporary: 1 }, nextQuestion: 'color_preference' },
      { text: "Bedroom - a personal sanctuary.", stylePoints: { minimalist: 1, serene: 2 }, nextQuestion: 'color_preference' },
      { text: "Home Office - for productivity.", stylePoints: { functional: 3, modern: 1 }, nextQuestion: 'color_preference' },
    ],
  },
  'color_preference': {
    question: "Which color palette do you prefer?",
    type: 'text',
    answers: [
      { text: "Cool neutrals: Grays, whites, and blacks.", stylePoints: { modern: 3, minimalist: 2 }, nextQuestion: null },
      { text: "Warm & earthy: Browns, greens, and terracotta.", stylePoints: { bohemian: 3, rustic: 2 }, nextQuestion: null },
      { text: "Vibrant & bold: Deep blues, rich reds, etc.", stylePoints: { eclectic: 3, maximalist: 2 }, nextQuestion: null },
      { text: "Soft pastels: Light pinks, baby blues, etc.", stylePoints: { scandinavian: 3, shabbyChic: 2 }, nextQuestion: null },
    ],
  },
};

// --- THIS IS THE MAJOR UPDATE ---
// We now add specific, bookable design packages to each style.
export const styles = {
    modern: { 
        name: "Modern", 
        description: "You prefer clean lines, simple color palettes, and the use of materials like metal, glass, and steel. Your space is ordered and clutter-free.",
        packages: [
            { id: 'MOD01', name: 'Sleek & Simple Living Room', price: 299, image: `${imageSource}modern,livingroom,white` },
            { id: 'MOD02', name: 'Monochrome Modern Office', price: 249, image: `${imageSource}modern,office,desk,monochrome` },
            { id: 'MOD03', name: 'Urban Loft Bedroom', price: 349, image: `${imageSource}modern,bedroom,city` },
        ]
    },
    minimalist: { 
        name: "Minimalist", 
        description: "You believe less is more. Your ideal space is ultra-clean, simple, and serene, focusing only on the essential elements.",
        packages: [
            { id: 'MIN01', name: 'Serene White Bedroom', price: 320, image: `${imageSource}minimalist,bedroom,white` },
            { id: 'MIN02', name: 'The Focused Workspace', price: 199, image: `${imageSource}minimalist,desk,apple` },
            { id: 'MIN03', name: 'Calm & Collected Living Area', price: 280, image: `${imageSource}minimalist,sofa,livingroom` },
        ]
    },
    bohemian: { 
        name: "Bohemian", 
        description: "You love a relaxed, carefree vibe. Your space is likely filled with plants, rich patterns, and items collected from travels.",
        packages: [
            { id: 'BOH01', name: 'Jungle Oasis Living Room', price: 350, image: `${imageSource}bohemian,livingroom,plants` },
            { id: 'BOH02', name: 'Cozy Rattan Bedroom', price: 300, image: `${imageSource}bohemian,bedroom,rattan` },
            { id: 'BOH03', name: 'Eclectic Reading Nook', price: 180, image: `${imageSource}bohemian,reading,cozy` },
        ]
    },
    // Add packages for all other styles...
};