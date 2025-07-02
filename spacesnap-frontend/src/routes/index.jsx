// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';

// --- Custom Routing Tools & Public Pages ---
import ProtectedRoute from './ProtectedRoute';
import DashboardGatewayPage from '../pages/DashboardGatewayPage';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import StyleQuizPage from '../pages/StyleQuizPage';
import AiVisualizerPage from '../pages/AiVisualizerPage';

// --- DASHBOARD PAGES (All imported from the SAME folder) ---
import AdminDashboardPage from '../pages/dashboards/AdminDashboardPage';
import UserManagementPage from '../pages/dashboards/UserManagementPage';
import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';
import UserProfilePage from '../pages/dashboards/UserProfilePage';
// Import other dashboard pages as you create them...
// import DesignerApprovalsPage from '../pages/dashboards/DesignerApprovalsPage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* === PUBLIC ROUTES === */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/style-quiz" element={<StyleQuizPage />} />
      <Route path="/visualizer" element={<AiVisualizerPage />} />
      
      {/* === GATEWAY ROUTE === */}
      <Route path="/dashboard" element={<DashboardGatewayPage />} />

      {/* === PROTECTED ROUTES (Your original, working structure) === */}
      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={ <ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute> } 
      />
      <Route 
        path="/admin/users" 
        element={ <ProtectedRoute allowedRoles={['admin']}><UserManagementPage /></ProtectedRoute> } 
      />
      
      {/* Designer & User Routes */}
      <Route 
        path="/designer/dashboard" 
        element={ <ProtectedRoute allowedRoles={['designer']}><DesignerDashboardPage /></ProtectedRoute> } 
      />
      <Route 
        path="/user/profile" 
        element={ <ProtectedRoute allowedRoles={['registered', 'premium']}><UserProfilePage /></ProtectedRoute> } 
      />
      
    </Routes>
  );
};

export default AppRoutes;