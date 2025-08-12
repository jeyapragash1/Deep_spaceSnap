// src/pages/StyleQuizPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { FaFilePdf, FaRedo, FaArrowRight, FaImage, FaPalette, FaHome, FaLightbulb, FaDownload, FaSpinner, FaSearchPlus, FaTimes } from 'react-icons/fa';
import jsPDF from 'jspdf';
import quizService from '../services/quizService';
import geminiService from '../services/geminiService';
import imageGenerationService from '../services/imageGenerationService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AIResponseFormatter from '../components/common/AIResponseFormatter';
import SimpleAIFormatter from '../components/common/SimpleAIFormatter';
import Toast from '../components/common/Toast';

// --- RESULTS COMPONENT ---
const QuizResults = ({ result, onRetake, geminiRecommendations, loadingRecommendations }) => {
    const navigate = useNavigate();
    const { recommendedStyle, styleDetails, selectedArt, selectedFurniture, styleScores } = result || {};
    
    // Image generation state with session storage persistence
    const [generatedImages, setGeneratedImages] = useState(() => {
        // Load from sessionStorage on component mount
        const savedImages = sessionStorage.getItem('generatedDesignImages');
        return savedImages ? JSON.parse(savedImages) : [];
    });
    const [loadingImages, setLoadingImages] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [imageGenerated, setImageGenerated] = useState(() => {
        // Check if images were already generated in this session
        const savedImages = sessionStorage.getItem('generatedDesignImages');
        return savedImages ? JSON.parse(savedImages).length > 0 : false;
    });
    
    // Zoom modal state
    const [zoomImage, setZoomImage] = useState(null);
    const [showZoomModal, setShowZoomModal] = useState(false);
    
    // Toast notification state
    const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
    
    // Use AI-generated style info if available, otherwise fallback to hardcoded
    const resultStyle = geminiRecommendations ? {
        name: geminiRecommendations.styleName,
        description: geminiRecommendations.styleDescription
    } : (styleDetails || { name: "Your Unique Style", description: "A style as unique as you!" });

    // Toast helper function
    const showToast = (message, type = 'info') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    // Save generated images to sessionStorage whenever they change
    useEffect(() => {
        if (generatedImages.length > 0) {
            sessionStorage.setItem('generatedDesignImages', JSON.stringify(generatedImages));
            console.log('Saved generated images to session storage');
        }
    }, [generatedImages]);

    // Clear session storage when user decides to retake quiz
    const handleRetakeQuiz = () => {
        sessionStorage.removeItem('generatedDesignImages');
        sessionStorage.removeItem('geminiRecommendations');
        setGeneratedImages([]);
        setImageGenerated(false);
        onRetake();
    };

    const handleGenerateImage = async () => {
        if (!geminiRecommendations) {
            showToast('Please wait for AI recommendations to be generated first.', 'warning');
            return;
        }
        
        // Check if images already generated
        if (imageGenerated && generatedImages.length > 0) {
            showToast('Images already generated! To generate new images, please retake the quiz.', 'info');
            return;
        }
        
        setLoadingImages(true);
        setImageError(null);
        
        try {
            console.log('Starting image generation...');
            const images = await imageGenerationService.generateStyleImages(
                geminiRecommendations.styleName,
                geminiRecommendations.styleDescription,
                geminiRecommendations
            );
            
            setGeneratedImages(images);
            setImageGenerated(true); // Mark as generated
            console.log('Images generated successfully:', images);
            showToast('Design image generated successfully! 🎨', 'success');
        } catch (error) {
            console.error('Image generation failed:', error);
            
            // Handle specific error types
            let errorMessage = 'Failed to generate images. Please try again.';
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                errorMessage = 'API authentication failed. Please check the API key.';
            } else if (error.message.includes('429')) {
                errorMessage = 'Too many requests. Please wait a few minutes and try again.';
            } else if (error.message.includes('403')) {
                errorMessage = 'Access forbidden. Please check API permissions.';
            } else if (error.message.includes('CORS')) {
                errorMessage = 'Cross-origin request blocked. The API may need to be called from a backend server.';
            }
            
            setImageError(errorMessage);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleDownloadImage = async (imageUrl, imageName) => {
        try {
            await imageGenerationService.downloadImage(imageUrl, `${imageName}_${resultStyle.name}.jpg`);
            showToast('Image download started! Check your downloads folder.', 'success');
        } catch (error) {
            showToast('Failed to download image. Please try again.', 'error');
        }
    };

    const handleZoomImage = (image) => {
        setZoomImage(image);
        setShowZoomModal(true);
    };

    const closeZoomModal = () => {
        setShowZoomModal(false);
        setZoomImage(null);
    };

    const handleTestAPI = async () => {
        try {
            const testResult = await imageGenerationService.testAPIConnection();
            if (testResult.success) {
                showToast('API Test Successful! Image generation is working.', 'success');
            } else {
                showToast(`API Test Failed: ${testResult.error}`, 'error');
            }
        } catch (error) {
            showToast(`Test error: ${error.message}`, 'error');
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
        
        // Function to clean and format text for PDF
        const formatTextForPDF = (text) => {
            if (!text) return '';
            
            // Remove ** markdown formatting
            let formatted = text.replace(/\*\*(.*?)\*\*/g, '$1');
            
            // Handle bullet points - convert to proper format
            formatted = formatted.replace(/^[•·-]\s*/gm, '• ');
            
            return formatted;
        };
        
        // Function to add bold text to PDF
        const addBoldText = (doc, text, x, y, maxWidth = 170) => {
            // Split text by ** markers to identify bold sections
            const parts = text.split(/(\*\*.*?\*\*)/);
            let currentX = x;
            const lineHeight = 6;
            let currentY = y;
            
            parts.forEach(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    // Bold text
                    doc.setFont('helvetica', 'bold');
                    const boldText = part.replace(/\*\*/g, '');
                    const lines = doc.splitTextToSize(boldText, maxWidth - (currentX - x));
                    lines.forEach(line => {
                        doc.text(line, currentX, currentY);
                        currentY += lineHeight;
                        currentX = x; // Reset x for new lines
                    });
                } else if (part.trim()) {
                    // Normal text
                    doc.setFont('helvetica', 'normal');
                    const lines = doc.splitTextToSize(part, maxWidth - (currentX - x));
                    lines.forEach(line => {
                        doc.text(line, currentX, currentY);
                        currentY += lineHeight;
                        currentX = x; // Reset x for new lines
                    });
                }
            });
            
            return currentY;
        };
        
        // Header with style name
        doc.setFillColor(0, 150, 136); // Teal color
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(`${geminiRecommendations ? geminiRecommendations.styleName : resultStyle.name} Style Guide`, 20, 25);
        
        // Reset text color
        doc.setTextColor(0, 0, 0);
        let yPos = 55;
        
        if (geminiRecommendations) {
            // AI Recommendations section
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('AI Design Recommendations', 20, yPos);
            yPos += 15;
            
            // Process the recommendations text
            const recommendations = geminiRecommendations.recommendations;
            const lines = recommendations.split('\n');
            
            doc.setFontSize(11);
            
            // Better text processing approach
            const processTextBlock = (text, isHeader = false, isBullet = false) => {
                const maxWidth = isBullet ? 155 : 170;
                const xPos = isBullet ? 25 : 20;
                const lineHeight = 6;
                const marginBottom = isHeader ? 8 : 4;
                
                // Clean the text
                const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
                
                // Set font style
                if (isHeader) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                } else {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                }
                
                // Split text to fit width
                const textLines = doc.splitTextToSize(cleanText, maxWidth);
                
                // Add each line
                textLines.forEach(textLine => {
                    // Check if we need a new page
                    if (yPos > 275) {
                        doc.addPage();
                        yPos = 25;
                    }
                    
                    doc.text(textLine, xPos, yPos);
                    yPos += lineHeight;
                });
                
                yPos += marginBottom;
            };
            
            // Process the text line by line with better handling
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) {
                    yPos += 3; // Small space for empty lines
                    continue;
                }
                
                // Handle section headers (lines with ** around text followed by :)
                if (line.match(/^\*\*[^*]+:\*\*/)) {
                    if (yPos > 50) yPos += 8; // Extra space before sections (except first)
                    processTextBlock(line, true, false);
                    continue;
                }
                
                // Handle bullet points
                if (line.startsWith('•') || line.startsWith('-') || line.startsWith('- ')) {
                    const bulletText = line.replace(/^[•-]\s*/, '');
                    processTextBlock(`• ${bulletText}`, false, true);
                    continue;
                }
                
                // Handle regular paragraphs
                if (line) {
                    processTextBlock(line, false, false);
                }
            }
            
            // Add summary section with better overflow handling
            if (yPos > 240) {
                doc.addPage();
                yPos = 25;
            }
            
            yPos += 15;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Analysis Summary', 20, yPos);
            yPos += 12;
            
            // User preferences section
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 60);
            doc.text('Based on Your Preferences:', 20, yPos);
            yPos += 8;
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            
            const preferencesText = geminiRecommendations.selectedPreferences.replace(/\n- /g, ' • ');
            const prefLines = doc.splitTextToSize(preferencesText, 170);
            
            prefLines.forEach(line => {
                if (yPos > 275) {
                    doc.addPage();
                    yPos = 25;
                }
                doc.text(line, 20, yPos);
                yPos += 5;
            });
            
            // Generation info
            yPos += 8;
            if (yPos > 270) {
                doc.addPage();
                yPos = 25;
            }
            
            doc.setFontSize(9);
            doc.setTextColor(120, 120, 120);
            doc.text(`Generated: ${new Date(geminiRecommendations.timestamp).toLocaleString()}`, 20, yPos);
            doc.text('Powered by AI Design Analysis', 20, yPos + 5);
        } else {
            // Fallback to original style info if no Gemini recommendations
            const styleInfo = getDetailedStyleDescription(resultStyle.name);
            
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Style Overview', 20, yPos);
            yPos += 10;
            
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const overviewLines = doc.splitTextToSize(styleInfo.overview, 170);
            doc.text(overviewLines, 20, yPos);
            yPos += overviewLines.length * 5 + 10;
        }
        
        // Footer - always at bottom of last page
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by SpaceSnap - Your Interior Design Assistant', 20, pageHeight - 10);
        
        const fileName = geminiRecommendations ? 
            `${geminiRecommendations.styleName}_AI_Recommendations.pdf` : 
            `${resultStyle.name}_Style_Guide.pdf`;
        
        doc.save(fileName);
    };
    const handleGoToVisualizer = () => navigate('/visualizer', { state: { suggestedStyle: recommendedStyle } });

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl text-center bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            {loadingRecommendations ? (
                <div className="mb-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎨 Analyzing Your Style Preferences</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            Our AI is carefully analyzing your 7 selections to create a personalized style profile just for you...
                        </p>
                        
                        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
                            <div className="flex items-center justify-center mb-6">
                                <LoadingSpinner />
                                <div className="ml-6 text-left">
                                    <div className="text-lg font-semibold text-gray-800 mb-2">AI Processing...</div>
                                    <div className="space-y-1 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            Analyzing your style preferences
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                                            Generating personalized recommendations
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                                            Creating your unique style profile
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 opacity-60">
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <FaPalette className="text-teal-500 text-2xl mx-auto mb-2" />
                                    <div className="text-xs text-gray-600">Color Analysis</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <FaHome className="text-blue-500 text-2xl mx-auto mb-2" />
                                    <div className="text-xs text-gray-600">Space Planning</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <FaLightbulb className="text-yellow-500 text-2xl mx-auto mb-2" />
                                    <div className="text-xs text-gray-600">Style Matching</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : geminiRecommendations ? (
                <div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-blue-100 rounded-2xl opacity-50"></div>
                        <div className="relative p-8">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-white rounded-full p-3 shadow-lg mr-4">
                                    <span className="text-3xl">✨</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-600">Your AI-Generated Style Profile</h2>
                            </div>
                            
                            <h3 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 mb-4">
                                {geminiRecommendations.styleName}
                            </h3>
                            
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto shadow-lg">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {geminiRecommendations.styleDescription}
                                </p>
                                
                                <div className="flex justify-center items-center mt-4 space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        AI Generated
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                        Personalized for You
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                        Based on 7 Preferences
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-red-500 mb-2">Unable to Generate AI Profile</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-gray-600 mb-4">Please try retaking the quiz</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">We encountered an issue generating your personalized style profile. Please retake the quiz for AI analysis.</p>
                </div>
            )}
            
            {/* Display AI Recommendations */}
            {!loadingRecommendations && (
                <div className="mb-8">
                    <h4 className="text-2xl font-semibold text-neutral-dark mb-6">
                        {geminiRecommendations ? 
                            `Detailed Design Recommendations for Your ${geminiRecommendations.styleName} Style` : 
                            'Design Recommendations'
                        }
                    </h4>
                    <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                        {geminiRecommendations ? 
                            `Based on your selected preferences, our AI has generated personalized design recommendations tailored specifically for your ${geminiRecommendations.styleName.toLowerCase()} style.` :
                            'Based on your selected preferences, our AI will generate personalized design recommendations.'
                        }
                    </p>
                
                {geminiRecommendations ? (
                    <div className="max-w-5xl mx-auto">
                        <SimpleAIFormatter response={geminiRecommendations.recommendations} />
                        
                        <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <FaLightbulb className="text-teal-600 mr-2" />
                                Analysis Summary
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-600 mb-2"><strong className="text-gray-800">Based on your selections:</strong></p>
                                    <p className="text-gray-700 leading-relaxed">{geminiRecommendations.selectedPreferences.replace(/\n- /g, ' • ')}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                    <p className="text-gray-600 mb-2"><strong className="text-gray-800">Generated:</strong></p>
                                    <p className="text-gray-700">{new Date(geminiRecommendations.timestamp).toLocaleString()}</p>
                                    <p className="text-teal-600 mt-2 font-medium">✨ Personalized by AI</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Generated Images Section */}
                        {(generatedImages.length > 0 || loadingImages) && (
                            <div className="mt-8">
                                <h4 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                                    <FaImage className="text-blue-600 mr-3" />
                                    AI-Generated Style Images
                                </h4>
                                
                                {loadingImages && (
                                    <div className="bg-blue-50 rounded-xl p-8 text-center">
                                        <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-4" />
                                        <h5 className="text-lg font-semibold text-gray-800 mb-2">Generating Your Custom Images...</h5>
                                        <p className="text-gray-600">Creating personalized interior design images based on your AI recommendations</p>
                                        <div className="mt-4 text-sm text-gray-500">
                                            This may take 30-60 seconds per image
                                        </div>
                                    </div>
                                )}
                                
                                {generatedImages.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {generatedImages.map((image, index) => (
                                            <motion.div
                                                key={image.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                                            >
                                                <div className="relative group">
                                                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            onLoad={() => {
                                                                console.log('Successfully loaded image:', image.imageUrl);
                                                            }}
                                                            onError={(e) => {
                                                                console.error('Failed to load image:', image.imageUrl);
                                                                console.log('Image failed due to CORS restrictions');
                                                                // Hide the broken image and show a message instead
                                                                e.target.style.display = 'none';
                                                                const parent = e.target.parentElement;
                                                                if (parent && !parent.querySelector('.cors-message')) {
                                                                    const message = document.createElement('div');
                                                                    message.className = 'cors-message flex flex-col items-center justify-center text-center p-4';
                                                                    message.innerHTML = `
                                                                        <div class="text-4xl mb-2">🎨</div>
                                                                        <div class="font-semibold text-gray-700 mb-1">Design Generated Successfully!</div>
                                                                        <div class="text-sm text-gray-500 mb-3">Image preview unavailable due to server restrictions</div>
                                                                        <div class="text-xs text-gray-400">Click download to save the image</div>
                                                                    `;
                                                                    parent.appendChild(message);
                                                                }
                                                            }}
                                                            referrerPolicy="no-referrer"
                                                            style={{ display: 'block' }}
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-3">
                                                        <button
                                                            onClick={() => handleZoomImage(image)}
                                                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center"
                                                        >
                                                            <FaSearchPlus className="mr-2" />
                                                            Zoom
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadImage(image.imageUrl, image.title)}
                                                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center"
                                                        >
                                                            <FaDownload className="mr-2" />
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h5 className="font-bold text-lg text-gray-800 mb-2">{image.title}</h5>
                                                    <p className="text-gray-600 text-sm">{image.description}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                                
                                {imageError && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
                                        <div className="text-orange-600 text-3xl mb-4">💳</div>
                                        <h5 className="font-semibold text-orange-800 mb-3 text-xl">
                                            {imageError.includes('credits') ? 'API Credits Needed' : 'Image Generation Issue'}
                                        </h5>
                                        <p className="text-orange-700 mb-6 leading-relaxed">{imageError}</p>
                                        
                                        {imageError.includes('credits') ? (
                                            <div className="bg-white p-4 rounded-lg border border-orange-100 mb-4">
                                                <h6 className="font-semibold text-gray-800 mb-2">To fix this:</h6>
                                                <ol className="text-left text-sm text-gray-700 space-y-1">
                                                    <li>1. Visit <a href="https://deepai.org/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">DeepAI Dashboard</a></li>
                                                    <li>2. Add credits to your account</li>
                                                    <li>3. Return here and try generating images again</li>
                                                </ol>
                                            </div>
                                        ) : (
                                            <Button 
                                                onClick={handleGenerateImage}
                                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 mb-4"
                                            >
                                                Try Again
                                            </Button>
                                        )}
                                        
                                        <div className="text-xs text-gray-500">
                                            <p>Note: Image generation requires DeepAI API credits</p>
                                            <p>Your style recommendations are complete and available above</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
                        <div className="mb-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 text-2xl">⚠️</span>
                            </div>
                            <h4 className="text-xl font-semibold text-red-700 mb-2">AI Analysis Unavailable</h4>
                            <p className="text-red-600">We couldn't generate your personalized style recommendations at this time.</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-red-100">
                            <p className="text-gray-600 text-sm mb-3">
                                <strong>What you can do:</strong>
                            </p>
                            <ul className="text-left text-sm text-gray-700 space-y-1">
                                <li>• Check your internet connection</li>
                                <li>• Try retaking the quiz</li>
                                <li>• Contact support if the issue persists</li>
                            </ul>
                        </div>
                    </div>
                )}
                </div>
            )}
            {!loadingRecommendations && (
                <div className="mb-8">
                    <h4 className="text-xl font-semibold text-gray-700 mb-6 text-center">Take Action with Your Style Profile</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                onClick={handleGenerateImage} 
                                disabled={loadingImages || !geminiRecommendations}
                                className={`w-full py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
                                    loadingImages || !geminiRecommendations
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    {loadingImages ? (
                                        <FaSpinner className="animate-spin mr-3 text-xl" />
                                    ) : (
                                        <FaImage className="mr-3 text-xl" />
                                    )}
                                    <div className="text-left">
                                        <div className="font-semibold">
                                            {loadingImages ? 'Generating Images...' : 
                                             generatedImages.length > 0 ? 'Generate New Images' : 'Generate Custom Images'}
                                        </div>
                                        <div className="text-sm opacity-90">
                                            {loadingImages ? 'Please wait...' : 'AI-powered design visualization'}
                                        </div>
                                    </div>
                                </div>
                            </Button>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                onClick={handleDownloadSummary} 
                                className="w-full py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center">
                                    <FaFilePdf className="mr-3 text-xl" />
                                    <div className="text-left">
                                        <div className="font-semibold">Download PDF Guide</div>
                                        <div className="text-sm opacity-90">Save Your Recommendations</div>
                                    </div>
                                </div>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            )}
            {!loadingRecommendations && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                    <div className="text-center mb-6">
                        <h4 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                            <span className="mr-3">🚀</span>
                            What's Next?
                        </h4>
                        <p className="text-gray-600">Continue your interior design journey with these options</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                onClick={handleGoToVisualizer} 
                                className="w-full py-4 px-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center">
                                    <div className="text-left">
                                        <div className="text-lg font-bold">AI Visualizer</div>
                                        <div className="text-sm opacity-90">See your style in action</div>
                                    </div>
                                    <FaArrowRight className="ml-3 text-xl" />
                                </div>
                            </Button>
                        </motion.div>
                        
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                onClick={handleRetakeQuiz} 
                                className="w-full py-4 px-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-center justify-center">
                                    <FaRedo className="mr-3 text-xl" />
                                    <div className="text-left">
                                        <div className="text-lg font-bold">Retake Quiz</div>
                                        <div className="text-sm opacity-90">Try different preferences</div>
                                    </div>
                                </div>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Zoom Modal - Best Practice Centered Popup */}
            <AnimatePresence>
                {showZoomModal && zoomImage && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40"
                            onClick={closeZoomModal}
                        />
                        
                        {/* Modal Popup */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                        >
                            <div 
                                className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-3xl">🎨</div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{zoomImage.title}</h2>
                                            <p className="text-sm text-gray-600 mt-1">{zoomImage.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={closeZoomModal}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                                        aria-label="Close modal"
                                    >
                                        <FaTimes className="text-xl text-gray-600 hover:text-gray-900" />
                                    </button>
                                </div>

                                {/* Modal Body - Scrollable if needed */}
                                <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                    {/* Image Container */}
                                    <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                                        <div className="relative bg-white rounded-xl shadow-inner p-2 border">
                                            <img
                                                src={zoomImage.imageUrl}
                                                alt={zoomImage.title}
                                                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                                                onLoad={() => {
                                                    console.log('Zoom image loaded successfully');
                                                }}
                                                onError={(e) => {
                                                    console.log('Zoom image failed, showing fallback');
                                                    e.target.style.display = 'none';
                                                    const parent = e.target.parentElement;
                                                    if (parent && !parent.querySelector('.error-fallback')) {
                                                        const fallback = document.createElement('div');
                                                        fallback.className = 'error-fallback flex flex-col items-center justify-center py-20 px-8';
                                                        fallback.innerHTML = `
                                                            <svg class="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                            </svg>
                                                            <h3 class="text-xl font-semibold text-gray-700 mb-2">Preview Unavailable</h3>
                                                            <p class="text-gray-500 text-center max-w-md mb-6">
                                                                Your design has been generated successfully but cannot be displayed due to browser security restrictions.
                                                            </p>
                                                            <div class="flex items-center space-x-2 text-sm text-blue-600">
                                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                                </svg>
                                                                <span>Use the download button below to save the full image</span>
                                                            </div>
                                                        `;
                                                        parent.appendChild(fallback);
                                                    }
                                                }}
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                        </div>

                                    </div>
                                </div>

                                {/* Modal Footer - Fixed at bottom */}
                                <div className="p-6 border-t bg-gray-50">
                                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                                        <div className="flex items-center space-x-4 text-sm">
                                            <span className="flex items-center text-green-600">
                                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                                </svg>
                                                Generated
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-600">High Resolution</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleDownloadImage(zoomImage.imageUrl, zoomImage.title)}
                                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center font-medium shadow-md hover:shadow-lg"
                                            >
                                                <FaDownload className="mr-2" />
                                                Download Image
                                            </button>
                                            <button
                                                onClick={closeZoomModal}
                                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                                            >
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
                duration={4000}
            />
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
    const [geminiRecommendations, setGeminiRecommendations] = useState(() => {
        // Load from sessionStorage on component mount
        const savedRecommendations = sessionStorage.getItem('geminiRecommendations');
        return savedRecommendations ? JSON.parse(savedRecommendations) : null;
    });
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

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

        // Track all selections for AI recommendations (both image and text)
        setSelectedImages(prev => [...prev, {
            questionId: currentQuestion.id,
            questionText: currentQuestion.question,
            name: answer.text || `Question ${currentQuestionIndex + 1} selection`,
            image: answer.image || null,
            type: currentQuestion.type
        }]);

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
                
                // Generate AI recommendations based on all selections
                const allSelectedImages = [...selectedImages, {
                    questionId: currentQuestion.id,
                    questionText: currentQuestion.question,
                    name: answer.text || `Question ${currentQuestionIndex + 1} selection`,
                    image: answer.image || null,
                    type: currentQuestion.type
                }];
                
                // Check if we already have recommendations in session storage
                const savedRecommendations = sessionStorage.getItem('geminiRecommendations');
                if (savedRecommendations) {
                    console.log('Using saved recommendations from session storage');
                    setGeminiRecommendations(JSON.parse(savedRecommendations));
                } else {
                    setLoadingRecommendations(true);
                    try {
                        console.log('Generating AI recommendations with selections:', allSelectedImages);
                        const recommendations = await geminiService.generateDesignRecommendations(allSelectedImages);
                        console.log('AI recommendations received:', recommendations);
                        setGeminiRecommendations(recommendations);
                        // Save to sessionStorage to persist across component re-renders
                        sessionStorage.setItem('geminiRecommendations', JSON.stringify(recommendations));
                    } catch (aiError) {
                        console.error('Failed to generate AI recommendations:', aiError);
                        console.error('Selection data that failed:', allSelectedImages);
                    } finally {
                        setLoadingRecommendations(false);
                    }
                }
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
        setGeminiRecommendations(null);
        setLoadingRecommendations(false);
        setSelectedImages([]);
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
                <QuizResults 
                    result={result} 
                    onRetake={handleRetakeQuiz} 
                    geminiRecommendations={geminiRecommendations}
                    loadingRecommendations={loadingRecommendations}
                />
            )}
        </div>
    );
};

export default StyleQuizPage;