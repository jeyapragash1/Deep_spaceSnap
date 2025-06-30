// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import StyleQuizPage from '../pages/StyleQuizPage';
import AIVisualizerPage from '../pages/AIVisualizerPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      {/* This line is now clean */}
      <Route path="/visualizer" element={<AIVisualizerPage />} />

      {/* This is a correctly formatted comment for a placeholder route */}
      <Route path="/packages" element={<div>Package Booking Page Placeholder</div>} />
    </Routes>
  );
};

export default AppRoutes;