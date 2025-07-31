// src/pages/StyleQuizPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { FaDownload, FaFilePdf, FaRedo, FaArrowRight } from 'react-icons/fa';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import quizService from '../services/quizService';
import LoadingSpinner from '../components/common/LoadingSpinner';

// --- RESULTS COMPONENT ---
const QuizResults = ({ result, onRetake }) => {
    const navigate = useNavigate();
    const { recommendedStyle, styleDetails, selectedArt, selectedFurniture, styleScores, styleRoomImages } = result || {};
    const resultStyle = styleDetails || { name: "Your Unique Style", description: "A style as unique as you!" };

    const handleDownloadImages = async () => {
        if (styleRoomImages && styleRoomImages.length > 0) {
            // Create a ZIP file with all room images
            const JSZip = await import('jszip');
            const zip = new JSZip.default();
            
            try {
                for (let i = 0; i < styleRoomImages.length; i++) {
                    const room = styleRoomImages[i];
                    const response = await fetch(room.imageUrl);
                    const blob = await response.blob();
                    const roomName = room.roomType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    zip.file(`${resultStyle.name}_${roomName}.jpg`, blob);
                }
                
                const content = await zip.generateAsync({type: "blob"});
                saveAs(content, `${resultStyle.name}_Style_Rooms.zip`);
            } catch (error) {
                console.error('Error creating ZIP:', error);
                alert("Error downloading images. Please try again.");
            }
        } else {
            alert("No room images available for download.");
        }
    };

    const getDetailedStyleDescription = (styleName) => {
        const descriptions = {
            modern: {
                overview: "Modern design embraces minimalism and functionality with clean lines, neutral colors, and uncluttered spaces. This style focuses on simplicity and efficiency while maintaining elegance.",
                characteristics: [
                    "Clean, geometric lines and shapes",
                    "Neutral color palette with bold accent colors",
                    "Open floor plans and spacious layouts",
                    "Minimal ornamentation and decoration",
                    "High-quality materials like steel, glass, and concrete"
                ],
                colors: "White, black, gray, with pops of bold colors like red, blue, or yellow",
                materials: "Glass, steel, concrete, leather, polished wood",
                tips: [
                    "Keep surfaces clean and uncluttered",
                    "Invest in statement furniture pieces",
                    "Use lighting as both function and art",
                    "Choose quality over quantity in decor"
                ]
            },
            scandinavian: {
                overview: "Scandinavian design emphasizes comfort, functionality, and natural beauty. Known for its cozy 'hygge' philosophy, this style creates warm, inviting spaces with light colors and natural materials.",
                characteristics: [
                    "Light, airy spaces with lots of natural light",
                    "Neutral colors with wood accents",
                    "Cozy textiles and comfortable furniture",
                    "Functional and practical design",
                    "Connection to nature through materials and colors"
                ],
                colors: "White, cream, light gray, natural wood tones, soft pastels",
                materials: "Light woods (pine, birch, oak), wool, linen, cotton",
                tips: [
                    "Maximize natural light with sheer curtains",
                    "Add cozy textiles like throws and pillows",
                    "Include plants and natural elements",
                    "Choose furniture with both beauty and function"
                ]
            },
            minimalist: {
                overview: "Minimalist design follows the 'less is more' philosophy, creating serene spaces through careful curation and intentional design choices. Every element serves a purpose.",
                characteristics: [
                    "Extremely clean and uncluttered spaces",
                    "Monochromatic or very limited color palette",
                    "High-quality, essential furniture only",
                    "Hidden storage solutions",
                    "Focus on space, light, and form"
                ],
                colors: "White, black, gray, with minimal color variation",
                materials: "High-quality woods, metals, stone, glass",
                tips: [
                    "Declutter regularly and keep only essentials",
                    "Choose multi-functional furniture",
                    "Use hidden storage to maintain clean lines",
                    "Let architectural features be the main focus"
                ]
            },
            bohemian: {
                overview: "Bohemian style celebrates creativity, individuality, and global influences. This eclectic approach mixes patterns, textures, and colors to create vibrant, personal spaces full of character.",
                characteristics: [
                    "Rich, warm colors and bold patterns",
                    "Mix of vintage and global decor",
                    "Layered textiles and textures",
                    "Plants and natural elements",
                    "Personal collections and artwork"
                ],
                colors: "Jewel tones, earth colors, warm oranges, deep purples, rich blues",
                materials: "Natural fibers, vintage woods, metals, ceramics, textiles",
                tips: [
                    "Layer rugs, pillows, and throws",
                    "Mix patterns and textures boldly",
                    "Display personal collections and travel souvenirs",
                    "Add lots of plants and natural elements"
                ]
            },
            rustic: {
                overview: "Rustic design brings the warmth and charm of countryside living indoors. This style emphasizes natural materials, handcrafted elements, and a cozy, lived-in feel.",
                characteristics: [
                    "Natural wood and stone materials",
                    "Warm, earthy color palette",
                    "Handcrafted and vintage furniture",
                    "Cozy, comfortable atmosphere",
                    "Connection to nature and outdoors"
                ],
                colors: "Warm browns, deep greens, rust oranges, cream, natural wood tones",
                materials: "Reclaimed wood, natural stone, wrought iron, leather, natural fibers",
                tips: [
                    "Embrace imperfections in materials",
                    "Use vintage and antique pieces",
                    "Add cozy lighting with warm bulbs",
                    "Include natural elements like wood and stone"
                ]
            },
            industrial: {
                overview: "Industrial design draws inspiration from warehouses and factories, celebrating raw materials and utilitarian beauty. This style combines rugged elements with modern functionality.",
                characteristics: [
                    "Exposed brick, metal, and concrete",
                    "Dark, moody color palette",
                    "Utilitarian furniture and fixtures",
                    "High ceilings and open spaces",
                    "Mix of rough and refined elements"
                ],
                colors: "Black, gray, brown, metallic tones, with minimal bright colors",
                materials: "Steel, iron, concrete, exposed brick, leather, dark woods",
                tips: [
                    "Expose architectural elements like pipes and beams",
                    "Use Edison bulb lighting fixtures",
                    "Choose furniture with metal and wood combinations",
                    "Keep the color palette dark and moody"
                ]
            },
            'shabby-chic': {
                overview: "Shabby Chic combines vintage charm with feminine elegance, featuring distressed furniture, soft pastels, and romantic details. This style creates dreamy, comfortable spaces.",
                characteristics: [
                    "Distressed and vintage furniture",
                    "Soft, romantic color palette",
                    "Floral patterns and delicate details",
                    "Mix of textures and fabrics",
                    "Feminine and cozy atmosphere"
                ],
                colors: "Soft pinks, whites, creams, lavender, mint green, vintage blues",
                materials: "Distressed wood, vintage fabrics, lace, cotton, linen",
                tips: [
                    "Mix vintage and new pieces",
                    "Use soft, flowing fabrics",
                    "Add floral patterns and delicate details",
                    "Create cozy reading nooks and comfortable seating"
                ]
            },
            eclectic: {
                overview: "Eclectic style celebrates creativity and individuality by mixing different periods, styles, and cultures. This bold approach creates unique, personal spaces that tell your story through carefully curated contrasts.",
                characteristics: [
                    "Mix of different design periods and styles",
                    "Bold patterns and unexpected combinations",
                    "Personal collections and unique finds",
                    "Creative use of color and texture",
                    "One-of-a-kind statement pieces"
                ],
                colors: "Rich jewel tones, mixed with neutrals, unexpected color combinations",
                materials: "Mix of materials: vintage woods, metals, textiles, ceramics",
                tips: [
                    "Follow the 80/20 rule: 80% cohesive base, 20% bold contrasts",
                    "Mix high and low-end pieces",
                    "Display personal collections as focal points",
                    "Layer different patterns and textures confidently"
                ]
            },
            traditional: {
                overview: "Traditional style embodies timeless elegance with classic furniture, rich colors, and refined details. This sophisticated approach creates warm, welcoming spaces that never go out of style.",
                characteristics: [
                    "Classic furniture with elegant lines",
                    "Rich, warm color palettes",
                    "Formal arrangements and symmetry",
                    "Quality fabrics and detailed woodwork",
                    "Timeless accessories and artwork"
                ],
                colors: "Deep burgundy, forest green, navy, gold, cream, warm browns",
                materials: "Rich woods, silk, velvet, wool, brass, crystal",
                tips: [
                    "Invest in quality, classic furniture pieces",
                    "Use symmetrical arrangements",
                    "Layer rich textures and fabrics",
                    "Add traditional patterns like florals and stripes"
                ]
            },
            classical: {
                overview: "Classical style draws inspiration from ancient Greek and Roman design, emphasizing symmetry, proportion, and grandeur. This sophisticated style creates majestic spaces with architectural details and refined elegance.",
                characteristics: [
                    "Symmetrical layouts and balanced proportions",
                    "Architectural details like columns and moldings",
                    "Neutral color palette with gold accents",
                    "Formal furniture arrangements",
                    "Grand scale and elegant proportions"
                ],
                colors: "Cream, ivory, soft gold, sage green, dusty blue, warm whites",
                materials: "Marble, limestone, rich woods, silk, damask, gold leaf",
                tips: [
                    "Focus on symmetry in furniture placement",
                    "Add architectural details like crown molding",
                    "Use classical proportions in room design",
                    "Incorporate columns or pilasters as focal points"
                ]
            },
            transitional: {
                overview: "Transitional style perfectly balances traditional warmth with contemporary clean lines. This versatile approach creates sophisticated, comfortable spaces that appeal to both classic and modern sensibilities.",
                characteristics: [
                    "Balance of traditional and contemporary elements",
                    "Neutral color schemes with subtle patterns",
                    "Mix of curved and straight lines",
                    "Comfortable, sophisticated furniture",
                    "Restrained use of accessories"
                ],
                colors: "Soft neutrals, warm grays, creams, subtle blues and greens",
                materials: "Mix of natural and man-made materials, quality fabrics",
                tips: [
                    "Start with a neutral base and add subtle patterns",
                    "Mix traditional and contemporary furniture",
                    "Keep accessories simple and sophisticated",
                    "Use quality materials in muted tones"
                ]
            },
            maximalist: {
                overview: "Maximalist style embraces the 'more is more' philosophy, celebrating abundance through bold patterns, rich colors, and layers of decoration. This confident approach creates vibrant, personality-filled spaces.",
                characteristics: [
                    "Bold patterns and rich, saturated colors",
                    "Layered textures and mixed materials",
                    "Abundant decorative objects and artwork",
                    "Dramatic lighting and statement pieces",
                    "Personal collections displayed prominently"
                ],
                colors: "Vibrant jewel tones, rich metallics, bold contrasts",
                materials: "Luxurious fabrics, mixed metals, rich woods, ornate details",
                tips: [
                    "Layer patterns confidently but maintain color harmony",
                    "Create gallery walls with varied artwork",
                    "Mix different textures and materials",
                    "Use dramatic lighting to highlight collections"
                ]
            }
        };
        
        return descriptions[styleName.toLowerCase()] || descriptions.modern;
    };

    const handleDownloadSummary = () => {
        const doc = new jsPDF();
        const styleInfo = getDetailedStyleDescription(resultStyle.name);
        
        // Header with style name
        doc.setFillColor(0, 150, 136); // Teal color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(`Your ${resultStyle.name} Style`, 20, 25);
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        let yPos = 55;
        
        // Style overview
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Style Overview', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const overviewLines = doc.splitTextToSize(styleInfo.overview, 170);
        doc.text(overviewLines, 20, yPos);
        yPos += overviewLines.length * 5 + 10;
        
        // Key Characteristics
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Characteristics', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        styleInfo.characteristics.forEach(char => {
            doc.text(`• ${char}`, 25, yPos);
            yPos += 6;
        });
        yPos += 5;
        
        // Colors & Materials
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Color Palette', 20, yPos);
        yPos += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const colorLines = doc.splitTextToSize(styleInfo.colors, 170);
        doc.text(colorLines, 20, yPos);
        yPos += colorLines.length * 5 + 8;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Materials', 20, yPos);
        yPos += 8;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const materialLines = doc.splitTextToSize(styleInfo.materials, 170);
        doc.text(materialLines, 20, yPos);
        yPos += materialLines.length * 5 + 10;
        
        // Tips (if space allows)
        if (yPos < 250) {
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Design Tips', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            styleInfo.tips.forEach(tip => {
                if (yPos < 280) {
                    doc.text(`• ${tip}`, 25, yPos);
                    yPos += 6;
                }
            });
        }
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(128, 128, 128);
        doc.text('Generated by SpaceSnap - Your Interior Design Assistant', 20, 285);
        
        doc.save(`${resultStyle.name}_Style_Guide.pdf`);
    };
    const handleGoToVisualizer = () => navigate('/visualizer', { state: { suggestedStyle: recommendedStyle } });

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl text-center bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">Your Style Profile is:</h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-primary-teal mb-4">{resultStyle.name}</h3>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">{resultStyle.description}</p>
            
            {/* Display style room images */}
            {styleRoomImages && styleRoomImages.length > 0 && (
                <div className="mb-8">
                    <h4 className="text-2xl font-semibold text-neutral-dark mb-6">Experience Your {resultStyle.name} Style</h4>
                    <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                        Discover how your personalized {resultStyle.name.toLowerCase()} style transforms different spaces in your home. 
                        Each room showcases the perfect balance of design elements that match your preferences.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {styleRoomImages.map((room, index) => (
                            <motion.div 
                                key={index} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={room.imageUrl} 
                                        alt={`${resultStyle.name} ${room.roomType}`} 
                                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="p-4 bg-white">
                                    <h5 className="font-bold text-lg text-gray-800 capitalize mb-1">
                                        {room.roomType.replace('-', ' ')}
                                    </h5>
                                    <p className="text-gray-600 text-sm">
                                        {resultStyle.name} style design
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Button onClick={handleDownloadImages} className="w-full py-3 text-lg bg-green-600 hover:bg-green-700">
                    <FaDownload className="inline mr-2" /> Download Room Images
                </Button>
                <Button onClick={handleDownloadSummary} className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700">
                    <FaFilePdf className="inline mr-2" /> Download Style Guide
                </Button>
            </div>
            <div className="bg-neutral-light p-6 rounded-lg"><h4 className="text-xl font-bold text-neutral-dark mb-4">What's Next?</h4><div className="flex flex-wrap justify-center items-center gap-4"><Button onClick={onRetake} className="bg-gray-500 hover:bg-gray-600"><FaRedo className="inline mr-2" /> Retake Quiz</Button><Button onClick={handleGoToVisualizer} className="bg-accent-gold text-white px-8 py-3 text-lg">Try this Style in the AI Visualizer <FaArrowRight className="inline ml-2" /></Button></div></div>
        </motion.div>
    );
};

// --- MAIN QUIZ PAGE COMPONENT ---
const StyleQuizPage = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sessionId] = useState(Date.now().toString());

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await quizService.getQuestions();
            setQuestions(data.questions || []);
            setLoading(false);
        } catch (err) {
            setError('Failed to load quiz questions');
            setLoading(false);
        }
    };

    const handleAnswerClick = async (answer) => {
        const currentQuestion = questions[currentQuestionIndex];
        const newAnswers = [...answers, { questionId: currentQuestion.id, answerId: answer.id }];
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Submit quiz
            try {
                setLoading(true);
                const quizResult = await quizService.submitQuiz(newAnswers, sessionId);
                setResult(quizResult);
                setIsFinished(true);
                setLoading(false);
            } catch (err) {
                setError('Failed to submit quiz');
                setLoading(false);
            }
        }
    };

    const handleRetakeQuiz = () => {
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setResult(null);
        setIsFinished(false);
        setError(null);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (questions.length === 0) return <div className="min-h-screen flex items-center justify-center">No questions available</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-yellow-50 p-4 flex flex-col items-center justify-center">
            {!isFinished ? (
                <motion.div key={currentQuestionIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl text-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6"><motion.div className="bg-primary-teal h-2.5 rounded-full" initial={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}></motion.div></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-10">{currentQuestion.question}</h2>
                    <AnimatePresence>
                        {currentQuestion.type === 'image' ? (
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentQuestion.answers.map((answer, index) => (
                                    <motion.button key={`${currentQuestionIndex}-${index}`} onClick={() => handleAnswerClick(answer)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                        <img src={answer.image} alt={`Style option ${index + 1}`} className="w-full h-64 object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                        {answer.text && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                <p className="text-white font-semibold text-lg">{answer.text}</p>
                                            </div>
                                        )}
                                    </motion.button>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {currentQuestion.answers.map((answer, index) => (
                                    <motion.button key={`${currentQuestionIndex}-${index}`} onClick={() => handleAnswerClick(answer)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} whileHover={{ scale: 1.05 }} className="p-6 bg-white rounded-lg shadow-md text-left hover:shadow-lg transition-shadow">
                                        <p className="text-lg font-semibold">{answer.text}</p>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <QuizResults result={result} onRetake={handleRetakeQuiz} />
            )}
        </div>
    );
};

export default StyleQuizPage;