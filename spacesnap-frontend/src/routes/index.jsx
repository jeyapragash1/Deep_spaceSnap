// src/routes/index.jsx

import { Routes, Route } from 'react-router-dom';

// --- Page Components ---
// Import every page component that your application will use.
import LandingPage from '../pages/LandingPage';
import StyleQuizPage from '../pages/StyleQuizPage';
import AiVisualizerPage from '../pages/AiVisualizerPage';
import ArPreviewPage from '../pages/ArPreviewPage';
import PortfolioPage from '../pages/PortfolioPage';
import AboutPage from '../pages/AboutPage';

// --- THIS IS THE FIX: The typo "pages.com" has been corrected to "pages" ---
import ContactPage from '../pages/ContactPage'; 


const AppRoutes = () => {
  return (
    <Routes>
      {/* 
        This is the main routing configuration for your application.
        Each <Route> defines a URL path and the page component to display for that path.
      */}

      {/* The homepage of your website */}
      <Route path="/" element={<LandingPage />} />

      {/* --- Main Feature Routes --- */}
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      <Route path="/visualizer" element={<AiVisualizerPage />} />
      <Route path="/ar-preview" element={<ArPreviewPage />} />
      
      {/* --- Informational and Other Routes --- */}
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* 
        You will add your protected dashboard and authentication routes here
        in the future, for example:
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} /> 
      */}

    </Routes>
  );
};

export default AppRoutes;