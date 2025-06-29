// src/routes/index.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// Import Pages
import HomePage from '../pages/HomePage';
import PortfolioPage from '../pages/PortfolioPage';
import AuthPage from '../pages/AuthPage';
import FeaturesPage from '../pages/FeaturesPage';
import AboutPage from '../pages/AboutPage';

// Import Dashboard Pages
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import StyleQuizPage from '../pages/dashboard/StyleQuizPage';
import AiVisualizerPage from '../pages/dashboard/AiVisualizerPage';
import MyDesignsPage from '../pages/dashboard/MyDesignsPage';
import AccountPage from '../pages/dashboard/AccountPage';

const AppRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  // Helper for pages with the public-facing layout
  const withMainLayout = (Component) => (
    <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <Component />
    </MainLayout>
  );

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={withMainLayout(HomePage)} />
      <Route path="/portfolio" element={withMainLayout(PortfolioPage)} />
      <Route path="/features" element={withMainLayout(FeaturesPage)} />
      <Route path="/about" element={withMainLayout(AboutPage)} />
      
      {/* Auth Routes */}
      <Route path="/login" element={!isLoggedIn ? <AuthPage setIsLoggedIn={setIsLoggedIn}/> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!isLoggedIn ? <AuthPage setIsLoggedIn={setIsLoggedIn}/> : <Navigate to="/dashboard" />} />

      {/* Protected Dashboard Routes */}
      <Route 
        path="/dashboard" 
        element={isLoggedIn ? <DashboardLayout setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
      >
        {/* The "Outlet" in DashboardLayout will render these nested routes */}
        <Route index element={<DashboardHomePage />} />
        <Route path="style-quiz" element={<StyleQuizPage />} />
        <Route path="visualizer" element={<AiVisualizerPage />} />
        <Route path="my-designs" element={<MyDesignsPage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;