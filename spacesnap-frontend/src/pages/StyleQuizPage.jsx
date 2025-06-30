// src/pages/StyleQuizPage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { quizQuestions, styles } from '../data/quizData';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';
import { FaHeart } from 'react-icons/fa';

// --- NEW ENHANCED RESULTS COMPONENT ---
const QuizResults = ({ scores }) => {
    // useNavigate hook from React Router to programmatically go to other pages
    const navigate = useNavigate();

    const getTopStyle = () => {
        if (!scores || Object.keys(scores).length === 0) return 'modern';
        let topStyleKey = 'modern';
        let maxScore = -1;
        for (const style in scores) {
            if (styles[style] && scores[style] > maxScore) { // Ensure the style exists
                maxScore = scores[style];
                topStyleKey = style;
            }
        }
        return topStyleKey;
    };

    const resultStyleKey = getTopStyle();
    const resultStyle = styles[resultStyleKey];

    // --- LOGIC FOR THE NEW FEATURES ---
    const handleBookNow = (packageName, price) => {
        // In a real app, this would redirect to a Stripe checkout page.
        // For now, we'll just show an alert.
        alert(`Booking confirmation: You are about to book the "${packageName}" package for $${price}.`);
        console.log(`User wants to book package: ${packageName}, Price: $${price}`);
    };

    const handleGoToVisualizer = () => {
        // This is the key part for Feature 2.
        // We navigate to the visualizer page and pass the quiz result in the "state".
        console.log(`Navigating to Visualizer with style: ${resultStyleKey}`);
        navigate('/visualizer', { state: { suggestedStyle: resultStyleKey } });
    };

    return (
        <div className="w-full max-w-6xl text-center p-8 bg-neutral-light rounded-lg shadow-xl animate-fadeIn">
            {/* --- Quiz Summary --- */}
            <h2 className="text-2xl font-bold mb-2">Your Primary Style is:</h2>
            <h3 className="text-5xl font-extrabold text-primary-teal mb-4">{resultStyle.name}</h3>
            <p className="text-gray-700 max-w-3xl mx-auto mb-10">{resultStyle.description}</p>

            {/* --- Suggested Design Packages --- */}
            <h4 className="text-3xl font-bold text-neutral-dark mb-6">Here are some designs you might love:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {resultStyle.packages.map((pkg) => (
                    <motion.div 
                        key={pkg.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
                        whileHover={{ y: -5, shadow: 'xl' }}
                    >
                        <img src={pkg.image} alt={pkg.name} className="w-full h-56 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h5 className="text-xl font-semibold text-neutral-dark mb-2">{pkg.name}</h5>
                            <p className="text-2xl font-bold text-primary-teal mb-4">${pkg.price}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <Button onClick={() => handleBookNow(pkg.name, pkg.price)}>
                                    Book This Design
                                </Button>
                                <FaHeart className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors" size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {/* --- Transition to Feature 2 --- */}
            <div className="bg-white p-8 rounded-lg border border-dashed border-primary-teal">
                <h4 className="text-2xl font-bold text-neutral-dark mb-3">Want to see it in YOUR room?</h4>
                <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                    Take your <span className="font-bold text-primary-teal">{resultStyle.name}</span> style and apply it directly to a photo of your own room with our AI Visualizer.
                </p>
                <Button onClick={handleGoToVisualizer} className="px-10 py-4 text-xl">
                    Go to AI Visualizer
                </Button>
            </div>
        </div>
    );
};


// The main quiz page component (this part remains the same)
const StyleQuizPage = () => {
    const [currentQuestionId, setCurrentQuestionId] = useState('start');
    const [scores, setScores] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswerClick = (answer) => {
        if (answer.stylePoints) {
            const newScores = { ...scores };
            for (const style in answer.stylePoints) {
                newScores[style] = (newScores[style] || 0) + answer.stylePoints[style];
            }
            setScores(newScores);
        }
        if (answer.nextQuestion) {
            setCurrentQuestionId(answer.nextQuestion);
        } else {
            setIsFinished(true);
        }
    };
    
    const currentQuestion = quizQuestions[currentQuestionId];

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
                {!isFinished ? (
                    <motion.div key={currentQuestionId} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl text-center">
                        <h2 className="text-3xl font-bold text-neutral-dark mb-10">{currentQuestion.question}</h2>
                        {currentQuestion.type === 'image' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentQuestion.answers.map((answer, index) => (
                                    <button key={index} onClick={() => handleAnswerClick(answer)} className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                        <img src={answer.image} alt={`Style option ${index + 1}`} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {currentQuestion.answers.map((answer, index) => (
                                    <button key={index} onClick={() => handleAnswerClick(answer)} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-primary-teal hover:text-white transition-all duration-300 text-left">
                                        <p className="text-lg font-semibold">{answer.text}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <QuizResults scores={scores} />
                )}
            </div>
        </MainLayout>
    );
};

export default StyleQuizPage;