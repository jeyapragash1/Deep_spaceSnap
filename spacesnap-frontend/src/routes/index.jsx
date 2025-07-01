// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';

// --- Our new tools for routing ---
import ProtectedRoute from './ProtectedRoute';
import DashboardGatewayPage from '../pages/DashboardGatewayPage';

// --- Page Components ---
import LandingPage from '../pages/LandingPage';
import StyleQuizPage from '../pages/StyleQuizPage';
import AiVisualizerPage from '../pages/AiVisualizerPage';
import LoginPage from '../pages/LoginPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// --- Dashboard Components ---
import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage';
import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';
import UserProfilePage from '../pages/dashboards/UserProfilePage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* === PUBLIC ROUTES === */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      <Route path="/visualizer" element={<AiVisualizerPage />} />
      
      {/* === GATEWAY ROUTE === */}
      {/* This single link will redirect users to their correct dashboard */}
      <Route path="/dashboard" element={<DashboardGatewayPage />} />

      {/* === PROTECTED ADMIN ROUTE === */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* === PROTECTED DESIGNER ROUTE === */}
      <Route 
        path="/designer/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['designer']}>
            <DesignerDashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* === PROTECTED USER ROUTE === */}
      <Route 
        path="/user/profile" 
        element={
          <ProtectedRoute allowedRoles={['registered', 'premium']}>
            <UserProfilePage />
          </ProtectedRoute>
        } 
      />

      {/* Add more protected routes here later, e.g., /admin/users, /designer/profile, etc. */}
      
    </Routes>
  );
};

export default AppRoutes;