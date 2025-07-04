// src/data/quizData.js

// --- We import all your local images ---
import img1 from '../assets/images/1.jpg'; import img2 from '../assets/images/2.jpg';
import img3 from '../assets/images/3.jpg'; import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.jpg'; import img6 from '../assets/images/6.jpg';
import img7 from '../assets/images/7.jpg'; import img8 from '../assets/images/8.jpg';
import img9 from '../assets/images/9.jpg'; import img10 from '../assets/images/10.jpg';
import img11 from '../assets/images/11.jpg'; import img12 from '../assets/images/12.jpg';
import img13 from '../assets/images/13.jpg'; import img14 from '../assets/images/14.jpg';
import img15 from '../assets/images/15.jpg'; import img16 from '../assets/images/16.jpg';
import img17 from '../assets/images/17.jpg'; import img18 from '../assets/images/18.jpg';
import img19 from '../assets/images/19.jpg'; import img20 from '../assets/images/20.jpg';

// --- The Quiz Questions (This part is already correct) ---
export const quizQuestions = {
    'start': {
        question: "Which of these rooms feels most like a place you'd love to relax in?", type: 'image',
        answers: [ { image: img1, stylePoints: { modern: 3, minimalist: 2 }, nextQuestion: 'q2_palette' }, { image: img2, stylePoints: { bohemian: 3, eclectic: 2 }, nextQuestion: 'q2_palette' }, { image: img3, stylePoints: { traditional: 3, rustic: 1 }, nextQuestion: 'q2_palette' }, { image: img4, stylePoints: { industrial: 3, modern: 1 }, nextQuestion: 'q2_palette' }, ],
    },
    'q2_palette': {
        question: "Which color palette are you most drawn to?", type: 'image',
        answers: [ { image: img5, stylePoints: { modern: 2, minimalist: 2 }, nextQuestion: 'q3_materials' }, { image: img6, stylePoints: { bohemian: 2, rustic: 2 }, nextQuestion: 'q3_materials' }, { image: img7, stylePoints: { traditional: 2, classic: 1 }, nextQuestion: 'q3_materials' }, { image: img8, stylePoints: { scandinavian: 2, coastal: 2 }, nextQuestion: 'q3_materials' }, ],
    },
    'q3_materials': {
        question: "Pick the texture that appeals to you most.", type: 'image',
        answers: [ { image: img9, stylePoints: { industrial: 2, rustic: 2 }, nextQuestion: 'q4_furniture' }, { image: img10, stylePoints: { modern: 2, minimalist: 1 }, nextQuestion: 'q4_furniture' }, { image: img11, stylePoints: { bohemian: 2, scandinavian: 1 }, nextQuestion: 'q4_furniture' }, { image: img12, stylePoints: { traditional: 2, classic: 2 }, nextQuestion: 'q4_furniture' }, ]
    },
    'q4_furniture': {
        question: "Which piece of furniture best fits your style?", type: 'image',
        answers: [ { image: img13, stylePoints: { modern: 3, minimalist: 1 }, nextQuestion: 'q5_art' }, { image: img14, stylePoints: { rustic: 3, industrial: 1 }, nextQuestion: 'q5_art' }, { image: img15, stylePoints: { bohemian: 3, eclectic: 1 }, nextQuestion: 'q5_art' }, { image: img16, stylePoints: { scandinavian: 3, minimalist: 2 }, nextQuestion: 'q5_art' }, ]
    },
    'q5_art': {
        question: "Which piece of art would you hang on your wall?", type: 'image',
        answers: [ { image: img17, stylePoints: { modern: 1, abstract: 3, minimalist: 2 }, nextQuestion: 'q6_lighting' }, { image: img18, stylePoints: { traditional: 2, classic: 2 }, nextQuestion: 'q6_lighting' }, { image: img19, stylePoints: { bohemian: 2, eclectic: 3 }, nextQuestion: 'q6_lighting' }, { image: img20, stylePoints: { coastal: 2, scandinavian: 1 }, nextQuestion: 'q6_lighting' }, ]
    },
    'q6_lighting': {
        question: "How do you prefer your lighting?", type: 'text',
        answers: [ { text: "Bright, open, and natural.", stylePoints: { scandinavian: 2, minimalist: 1 }, nextQuestion: 'q7_vibe' }, { text: "Warm, moody, and atmospheric.", stylePoints: { bohemian: 2, industrial: 1 }, nextQuestion: 'q7_vibe' }, { text: "Statement-making and dramatic.", stylePoints: { eclectic: 2, modern: 1 }, nextQuestion: 'q7_vibe' }, { text: "Classic and elegant.", stylePoints: { traditional: 2 }, nextQuestion: 'q7_vibe' }, ]
    },
    'q7_vibe': {
        question: "Finally, which word best describes your ideal space?", type: 'text',
        answers: [ { text: "Uncluttered", stylePoints: { minimalist: 3 }, nextQuestion: null }, { text: "Cozy", stylePoints: { bohemian: 3 }, nextQuestion: null }, { text: "Sophisticated", stylePoints: { modern: 3 }, nextQuestion: null }, { text: "Playful", stylePoints: { eclectic: 3 }, nextQuestion: null }, ],
    },
};

// --- THIS IS THE FIX: Every style now has a 'resultImage' property ---
export const styles = {
    modern: { 
        name: "Modern", 
        description: "You prefer clean lines, simple color palettes, and the use of materials like metal, glass, and steel. Your space is ordered and clutter-free.",
        resultImage: img1,
    },
    minimalist: { 
        name: "Minimalist", 
        description: "You believe less is more. Your ideal space is ultra-clean, simple, and serene, focusing only on the essential elements.",
        resultImage: img7,
    },
    bohemian: { 
        name: "Bohemian", 
        description: "You love a relaxed, carefree vibe. Your space is likely filled with plants, rich patterns, and items collected from travels.",
        resultImage: img2,
    },
    industrial: { 
        name: "Industrial", 
        description: "Inspired by warehouses and lofts, you appreciate raw materials like exposed brick, metal, and concrete.",
        resultImage: img4 
    },
    scandinavian: { 
        name: "Scandinavian", 
        description: "You crave light, airy spaces that feel calm and cozy. Wood accents and soft textures are your best friends.",
        resultImage: img6 
    },
    rustic: { 
        name: "Rustic", 
        description: "You're drawn to natural, rugged beauty, emphasizing raw wood, stone, and earthy colors.",
        resultImage: img5 
    },
    traditional: { 
        name: "Traditional", 
        description: "You appreciate classic details, ornate furnishings, and a sense of timeless elegance.",
        resultImage: img3 
    },
    eclectic: { 
        name: "Eclectic", 
        description: "You have a high-energy style that loves to mix and match different eras, textures, and bold colors.",
        resultImage: img8 
    },
    coastal: { 
        name: "Coastal", 
        description: "You love light, breezy, and beach-inspired spaces that feel open and relaxed.",
        resultImage: img20 
    },
    classic: {
        name: "Classic",
        description: "Your taste leans towards orderly, symmetrical designs that are rooted in history and tradition.",
        resultImage: img18
    }
};