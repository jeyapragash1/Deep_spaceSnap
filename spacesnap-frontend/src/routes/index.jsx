// src/routes/index.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// --- LAYOUTS ---
import MainLayout from '../components/layout/MainLayout';
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import UserDashboardLayout from '../components/layout/UserDashboardLayout';

// --- ALL PAGE COMPONENTS ---
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import PortfolioPage from '../pages/PortfolioPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import StyleQuizPage from '../pages/StyleQuizPage'; 
import AiVisualizerPage from '../pages/AiVisualizerPage';
import ArPreviewPage from '../pages/ArPreviewPage';
import AdminDashboardOverview from '../pages/dashboards/admin/AdminDashboardOverview';
import UserManagement from '../pages/dashboards/admin/UserManagement';
import DesignerApprovals from '../pages/dashboards/admin/DesignerApprovals';
import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';
import UserProfilePage from '../pages/dashboards/UserProfilePage';
import MyDesignsPage from '../pages/dashboards/MyDesignsPage';
import ConsultationsPage from '../pages/dashboards/ConsultationsPage';

// --- THIS IS THE FIX: We import the missing page ---
import AccountPage from '../pages/dashboards/AccountPage'; 


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

const PublicLayoutWrapper = () => ( <MainLayout><Outlet /></MainLayout> );


// --- MAIN ROUTER ---
const AppRoutes = () => {
    return (
        <Routes>
            {/* === 1. PUBLIC ROUTES (All use MainLayout) === */}
            <Route element={<PublicLayoutWrapper />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
            </Route>

            {/* === 2. AUTH ROUTES (Have their own layout) === */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp/:userId" element={<OtpVerificationPage />} />
            
            {/* === 3. PROTECTED ROUTES GROUP === */}
            <Route element={<ProtectedRouteLogic />}>
                <Route path="/dashboard" element={<DashboardGateway />} />
                
                <Route element={<MainLayout><Outlet /></MainLayout>}>
                    <Route path="/style-quiz" element={<StyleQuizPage />} />
                    <Route path="/ar-preview" element={<ArPreviewPage />} />
                </Route>
                <Route path="/visualizer" element={<AiVisualizerPage />} />
                
                {/* --- Admin Dashboard Routes --- */}
                <Route path="/admin" element={<AdminDashboardLayout />}>
                    <Route index element={<AdminDashboardOverview />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="approvals" element={<DesignerApprovals />} />
                </Route>

                {/* --- User/Designer Dashboard Routes --- */}
                <Route element={<UserDashboardLayout />}>
                    <Route path="/user/profile" element={<UserProfilePage />} />
                    <Route path="/user/designs" element={<MyDesignsPage />} />
                    <Route path="/user/account" element={<AccountPage />} />
                    <Route path="/user/consultations" element={<ConsultationsPage />} />
                    
                    <Route path="/designer/dashboard" element={<DesignerDashboardPage />} />
                    <Route path="/designer/designs" element={<MyDesignsPage />} />
                </Route>

            </Route>
        </Routes>
    );
};

export default AppRoutes;