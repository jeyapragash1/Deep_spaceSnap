// src/routes/index.jsx

import { Routes, Route } from 'react-router-dom';

// --- Our custom routing tools ---
import ProtectedRoute from './ProtectedRoute';
import DashboardGatewayPage from '../pages/DashboardGatewayPage';

// --- Page Components ---
import LandingPage from '../pages/LandingPage';
import StyleQuizPage from '../pages/StyleQuizPage';
import AiVisualizerPage from '../pages/AiVisualizerPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import UpgradePage from '../pages/UpgradePage';

// --- Dashboard Components ---
import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage';
import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';
import UserProfilePage from '../pages/dashboards/UserProfilePage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* === PUBLIC ROUTES (Accessible to everyone) === */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* === SEMI-PROTECTED ROUTES (Can be accessed by anyone, but might require login for full features) === */}
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      <Route path="/visualizer" element={<AiVisualizerPage />} />
      
      {/* === GATEWAY ROUTE === */}
      {/* A single, simple link that sends users to their correct dashboard */}
      <Route path="/dashboard" element={<DashboardGatewayPage />} />

      {/* === PROTECTED ROUTES (Require login and specific roles) === */}

      {/* --- Admin Routes --- */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* --- Designer Routes --- */}
      <Route 
        path="/designer/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['designer']}>
            <DesignerDashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* --- User/Customer Routes --- */}
      <Route 
        path="/user/profile" 
        element={
          <ProtectedRoute allowedRoles={['registered', 'premium']}>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/upgrade" 
        element={
          <ProtectedRoute allowedRoles={['registered']}>
            <UpgradePage />
          </ProtectedRoute>
        } 
      />
      
    </Routes>
  );
};

export default AppRoutes;