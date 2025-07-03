// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Layouts
import MainLayout from '../components/layout/MainLayout';
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import UserDashboardLayout from '../components/layout/UserDashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import PortfolioPage from '../pages/PortfolioPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';

// Auth Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// Protected Feature Pages
import StyleQuizPage from '../pages/StyleQuizPage'; 
import AiVisualizerPage from '../pages/AiVisualizerPage';
import ArPreviewPage from '../pages/ArPreviewPage';
import UpgradePage from '../pages/UpgradePage';

// Dashboard Content Pages
import AdminDashboardOverview from '../pages/dashboards/admin/AdminDashboardOverview';
import UserManagement from '../pages/dashboards/admin/UserManagement';
import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';
import UserProfilePage from '../pages/dashboards/UserProfilePage';
import DesignerApprovals from '../pages/dashboards/admin/DesignerApprovals';
import ContentModeration from '../pages/dashboards/admin/ContentModeration';
import SystemSettings from '../pages/dashboards/admin/SystemSettings';


// --- ROUTING LOGIC COMPONENTS (Self-contained) ---

const ProtectedRouteLogic = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>;
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    return <Outlet />;
};

const DashboardGateway = () => {
    const { user } = useAuth();
    switch (user?.role) {
        case 'admin': return <Navigate to="/admin" replace />;
        case 'designer': return <Navigate to="/designer/dashboard" replace />;
        default: return <Navigate to="/user/profile" replace />;
    }
};

// --- MAIN ROUTER ---
const AppRoutes = () => {
    return (
        <Routes>
            {/* === Public Routes (Use MainLayout) === */}
            <Route element={<MainLayout><Outlet /></MainLayout>}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
            </Route>

            {/* === Auth Routes (Have their own layout) === */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp/:userId" element={<OtpVerificationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* === PROTECTED ROUTES GROUP === */}
            <Route element={<ProtectedRouteLogic />}>
                <Route path="/dashboard" element={<DashboardGateway />} />
                
                <Route element={<MainLayout><Outlet /></MainLayout>}>
                    <Route path="/style-quiz" element={<StyleQuizPage />} />
                    <Route path="/visualizer" element={<AiVisualizerPage />} />
                    <Route path="/ar-preview" element={<ArPreviewPage />} />
                </Route>
                
                <Route path="/upgrade" element={<UpgradePage />} />

                <Route path="/admin" element={<AdminDashboardLayout />}>
                    <Route index element={<AdminDashboardOverview />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="approvals" element={<DesignerApprovals />} />
                    <Route path="content" element={<ContentModeration />} />
                    <Route path="settings" element={<SystemSettings />} />
                </Route>

                <Route path="/user" element={<UserDashboardLayout />}>
                    <Route path="profile" element={<UserProfilePage />} />
                </Route>
                <Route path="/designer" element={<UserDashboardLayout />}>
                    <Route path="dashboard" element={<DesignerDashboardPage />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;