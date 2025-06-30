// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import StyleQuizPage from '../pages/StyleQuizPage'; 

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* This is the correct way to add a comment inside JSX */}
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      
      {/* You can add your other routes here later */}
      {/* 
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
      */}
    </Routes>
  );
};

export default AppRoutes;