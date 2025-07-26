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
    const { recommendedStyle, styleDetails, selectedArt, selectedFurniture, styleScores } = result || {};
    const resultStyle = styleDetails || { name: "Your Unique Style", description: "A style as unique as you!" };

    const handleDownloadImage = () => {
        if (resultStyle.image) { saveAs(resultStyle.image, `SpaceSnap_Design_${resultStyle.name}.jpg`); }
        else { alert("Sorry, no image is available for download for this style."); }
    };
    const handleDownloadSummary = () => {
        const doc = new jsPDF();
        doc.setFontSize(22); doc.text("Your SpaceSnap Style Summary", 14, 22);
        doc.setFontSize(16); doc.text(`Primary Style: ${resultStyle.name}`, 14, 40);
        doc.setFontSize(12);
        const descriptionLines = doc.splitTextToSize(resultStyle.description, 180);
        doc.text(descriptionLines, 14, 50);
        doc.save(`SpaceSnap_Style_Summary_${resultStyle.name}.pdf`);
    };
    const handleGoToVisualizer = () => navigate('/visualizer', { state: { suggestedStyle: recommendedStyle } });

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl text-center bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-gray-500 mb-2">Your Style Profile is:</h2>
            <h3 className="text-5xl md:text-6xl font-extrabold text-primary-teal mb-4">{resultStyle.name}</h3>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">{resultStyle.description}</p>
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <h4 className="text-lg font-semibold text-neutral-dark p-3 bg-gray-50 border-b">Your Style Elements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {selectedArt && (
                        <div>
                            <h5 className="font-semibold mb-2">Selected Art</h5>
                            <img src={selectedArt.image} alt="Selected art" className="w-full h-40 object-cover rounded" />
                        </div>
                    )}
                    {selectedFurniture && (
                        <div>
                            <h5 className="font-semibold mb-2">Selected Furniture</h5>
                            <img src={selectedFurniture.image} alt="Selected furniture" className="w-full h-40 object-cover rounded" />
                        </div>
                    )}
                </div>
                {resultStyle.image && <img src={resultStyle.image} alt={`Suggested ${resultStyle.name} design`} className="w-full h-auto" />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"><Button onClick={handleDownloadImage} className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"><FaDownload className="inline mr-2" /> Download Design Image</Button><Button onClick={handleDownloadSummary} className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"><FaFilePdf className="inline mr-2" /> Download Summary PDF</Button></div>
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