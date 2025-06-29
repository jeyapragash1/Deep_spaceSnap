// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import PortfolioPage from '../pages/PortfolioPage';
import DashboardPage from '../pages/DashboardPage';
import AuthPage from '../pages/AuthPage';
import FeaturesPage from '../pages/FeaturesPage'; // <-- IMPORT MISSING PAGE
import AboutPage from '../pages/AboutPage';       // <-- IMPORT MISSING PAGE

const AppRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  const withLayout = (Component) => (
    <MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
      <Component />
    </MainLayout>
  );

  return (
    <Routes>
      {/* Routes WITH Header and Footer */}
      <Route path="/" element={withLayout(HomePage)} />
      <Route path="/portfolio" element={withLayout(PortfolioPage)} />
      <Route path="/dashboard" element={withLayout(DashboardPage)} />
      <Route path="/features" element={withLayout(FeaturesPage)} /> {/* <-- ADDED ROUTE */}
      <Route path="/about" element={withLayout(AboutPage)} />       {/* <-- ADDED ROUTE */}
      
      {/* Route WITHOUT Header and Footer (Full screen page) */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
    </Routes>
  );
};

export default AppRoutes;