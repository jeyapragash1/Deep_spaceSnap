// src/routes/index.jsx

import { Routes, Route } from 'react-router-dom';

// --- Custom Routing Components ---
import ProtectedRoute from './ProtectedRoute';
import DashboardGatewayPage from '../pages/DashboardGatewayPage';

// --- Main Layout Components ---
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import UserDashboardLayout from '../components/layout/UserDashboardLayout';

// --- Public Page Components ---
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import PortfolioPage from '../pages/PortfolioPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';

// --- Core Feature Page Components ---
import StyleQuizPage from '../pages/StyleQuizPage';
import AiVisualizerPage from '../pages/AiVisualizerPage';
import ArPreviewPage from '../pages/ArPreviewPage';
import UpgradePage from '../pages/UpgradePage';

// --- Dashboard Content Page Components (Now they all exist) ---
import AdminDashboardOverview from '../pages/dashboards/admin/AdminDashboardOverview';
import UserManagement from '../pages/dashboards/admin/UserManagement';
import UserProfilePage from '../pages/dashboards/UserProfilePage';
import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* ======================================================= */}
      {/* === PUBLIC ROUTES (Accessible to all, no login needed) === */}
      {/* ======================================================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />


      {/* ========================================================== */}
      {/* === PROTECTED CORE FEATURE ROUTES (Must be logged in) === */}
      {/* ========================================================== */}
      <Route path="/style-quiz" element={<ProtectedRoute><StyleQuizPage /></ProtectedRoute>} />
      <Route path="/visualizer" element={<ProtectedRoute><AiVisualizerPage /></ProtectedRoute>} />
      <Route path="/ar-preview" element={<ProtectedRoute><ArPreviewPage /></ProtectedRoute>} />


      {/* ======================================================= */}
      {/* === DASHBOARD GATEWAY (Redirects based on user role) === */}
      {/* ======================================================= */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['registered', 'premium', 'designer', 'admin']}>
            <DashboardGatewayPage />
          </ProtectedRoute>
        } 
      />


      {/* =================================================================== */}
      {/* === USER & DESIGNER DASHBOARD (Nested inside UserDashboardLayout) === */}
      {/* =================================================================== */}
      <Route 
        element={
          <ProtectedRoute allowedRoles={['registered', 'premium', 'designer']}>
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/designer/dashboard" element={<DesignerDashboardPage />} />
      </Route>

      
      {/* ============================================================ */}
      {/* === ADMIN DASHBOARD (Nested inside AdminDashboardLayout) === */}
      {/* ============================================================ */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardOverview />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      
      {/* ============================================================== */}
      {/* === SPECIAL ROUTES (like the upgrade page for specific roles) === */}
      {/* ============================================================== */}
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