// src/pages/StyleQuizPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, styles } from '../data/quizData';
import QuizLayout from '../components/layout/QuizLayout';
import Button from '../components/common/Button';
import { FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- Results Component (The new, detailed summary) ---
const QuizResults = ({ scores, traits }) => {
    const getTopStyle = () => {
        let topStyle = '';
        let maxScore = -1;
        for (const style in scores) {
            if (scores[style] > maxScore) {
                maxScore = scores[style];
                topStyle = style;
            }
        }
        return topStyle || 'eclectic'; // Default style
    };

    const resultStyleKey = getTopStyle();
    const resultStyle = styles[resultStyleKey];

    if (!resultStyle) return <div>Calculating your style...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            {/* 1. Hero Section for the result */}
            <div className="relative rounded-lg overflow-hidden text-white text-center p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
                <img src={resultStyle.heroImage} alt={resultStyle.name} className="absolute inset-0 w-full h-full object-cover z-[-1]" />
                <h2 className="relative text-xl font-medium opacity-80 mb-2">YOUR DESIGN STYLE IS</h2>
                <h1 className="relative text-5xl md:text-7xl font-extrabold">{resultStyle.name}</h1>
            </div>

            <div className="bg-white p-6 md:p-10 -mt-16 relative z-10 max-w-5xl mx-auto rounded-lg shadow-2xl">
                {/* 2. Description and "Why" summary */}
                <div className="grid md:grid-cols-2 gap-10 mb-10">
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-dark mb-3">What this means...</h3>
                        <p className="text-gray-700 leading-relaxed">{resultStyle.description}</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-neutral-dark mb-3">Why you're a {resultStyle.name}</h3>
                        <ul className="space-y-2">
                            {traits.slice(0, 4).map((trait, index) => (
                                <li key={index} className="flex items-start">
                                    <FaCheck className="text-primary-teal mr-3 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">You {trait}.</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 3. Key Elements */}
                <div className="mb-10">
                    <h3 className="text-2xl font-bold text-neutral-dark text-center mb-6">Key Elements of This Style</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {resultStyle.keyElements.map(element => (
                            <div key={element} className="bg-neutral-light p-4 rounded-lg">
                                <p className="font-semibold text-neutral-dark">{element}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Inspiration Gallery */}
                <div>
                    <h3 className="text-2xl font-bold text-neutral-dark text-center mb-6">Get Inspired</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {resultStyle.galleryImages.map((img, index) => (
                            <img key={index} src={img} alt={`${resultStyle.name} inspiration ${index + 1}`} className="w-full h-64 object-cover rounded-lg shadow-md" />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- Main Quiz Page Component ---
const StyleQuizPage = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({});
    const [traits, setTraits] = useState([]); // State to hold user traits
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswerClick = (answer) => {
        // Update scores
        const newScores = { ...scores };
        for (const style in answer.stylePoints) {
            newScores[style] = (newScores[style] || 0) + answer.stylePoints[style];
        }
        setScores(newScores);

        // Update traits
        if (answer.trait) {
            setTraits([...traits, answer.trait]);
        }

        // Move to next question or finish
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < quizQuestions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            setIsFinished(true);
        }
    };

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    return (
        <QuizLayout>
            <div className="w-full max-w-4xl p-4">
                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4 }} className="w-full">
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                                <motion.div className="bg-primary-teal h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}></motion.div>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-bold text-neutral-dark text-center mb-10">{currentQuestion.question}</h2>
                            {currentQuestion.type === 'image' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {currentQuestion.answers.map((answer, index) => (
                                        <button key={index} onClick={() => handleAnswerClick(answer)} className="group block text-left bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                            <img src={answer.image} alt={answer.text} className="w-full h-48 object-cover" />
                                            <p className="p-4 text-lg font-semibold text-neutral-dark group-hover:text-primary-teal">{answer.text}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {currentQuestion.answers.map((answer, index) => (
                                        <button key={index} onClick={() => handleAnswerClick(answer)} className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-primary-teal hover:text-white transition-all duration-300">
                                            <p className="text-lg font-semibold">{answer.text}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <QuizResults scores={scores} traits={traits} />
                    )}
                </AnimatePresence>
            </div>
        </QuizLayout>
    );
};

export default StyleQuizPage;