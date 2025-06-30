// src/routes/index.jsx

import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import StyleQuizPage from '../pages/StyleQuizPage'; 
import AiVisualizerPage from '../pages/AiVisualizerPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      <Route path="/visualizer" element={<AiVisualizerPage />} />
    </Routes>
  );
};

export default AppRoutes;