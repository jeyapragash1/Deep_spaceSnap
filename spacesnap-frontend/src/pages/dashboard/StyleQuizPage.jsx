// src/pages/dashboard/StyleQuizPage.jsx
import React, { useState } from 'react';
import Button from '../../components/common/Button';

const questions = [
  { question: "Which color palette do you prefer?", options: ["Warm Neutrals (Beige, Cream)", "Cool Tones (Blue, Gray)", "Earthy Hues (Green, Brown)", "Bold & Vibrant"] },
  { question: "What's your favorite material?", options: ["Natural Wood", "Sleek Metal", "Plush Fabrics", "Exposed Brick"] },
  { question: "Choose a style that speaks to you.", options: ["Modern & Minimalist", "Cozy & Rustic", "Bohemian & Eclectic", "Industrial & Edgy"] },
];

const StyleQuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  if (quizCompleted) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
        <p className="text-lg mb-6">Based on your answers, your primary style is **Modern & Minimalist**.</p>
        <p className="mb-8">We'll use these preferences to guide you in the AI Visualizer.</p>
        <Button onClick={() => setQuizCompleted(false)}>Take Again</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Style Quiz ({currentQuestion + 1}/{questions.length})</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">{questions[currentQuestion].question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions[currentQuestion].options.map(option => (
            <button key={option} onClick={() => handleAnswer(option)} className="p-4 text-left border rounded-lg hover:bg-teal-100 transition-colors">
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StyleQuizPage;