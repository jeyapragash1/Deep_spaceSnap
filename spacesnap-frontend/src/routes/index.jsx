// src/routes/index.jsx

import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

// --- LAYOUTS ---
import MainLayout from '../components/layout/MainLayout';
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import UserDashboardLayout from '../components/layout/UserDashboardLayout';

// --- PUBLIC PAGES ---
import LandingPage from '../pages/LandingPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import PortfolioPage from '../pages/PortfolioPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsOfServicePage from '../pages/TermsOfServicePage';

// --- AUTH PAGES ---
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OtpVerificationPage from '../pages/OtpVerificationPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';

// --- PROTECTED FEATURE PAGES ---
import StyleQuizPage from '../pages/StyleQuizPage'; 
import AiVisualizerPage from '../pages/AiVisualizerPage';
import ArPreviewPage from '../pages/ArPreviewPage';
import UpgradePage from '../pages/UpgradePage';

// --- DASHBOARD PAGES ---
import AdminDashboardOverview from '../pages/dashboards/admin/AdminDashboardOverview';
import UserManagement from '../pages/dashboards/admin/UserManagement';
import DesignerApprovals from '../pages/dashboards/admin/DesignerApprovals';
import ContentModeration from '../pages/dashboards/admin/ContentModeration';
import SystemSettings from '../pages/dashboards/admin/SystemSettings';
import EmailTemplatesPage from '../pages/dashboards/admin/EmailTemplatesPage';
import FeatureFlagsPage from '../pages/dashboards/admin/FeatureFlagsPage';
import PortfolioManagement from '../pages/dashboards/admin/PortfolioManagement'; 
import PaymentSettingsPage from '../pages/dashboards/admin/PaymentSettingsPage';

import UserProfilePage from '../pages/dashboards/UserProfilePage';
import MyDesignsPage from '../pages/dashboards/MyDesignsPage';
import AccountPage from '../pages/dashboards/AccountPage';
import ConsultationsPage from '../pages/dashboards/ConsultationsPage';
import ConsultationDetailPage from '../pages/dashboards/ConsultationDetailPage';
import DesignersListPage from '../pages/dashboards/DesignersListPage'; 

import DesignerDashboardPage from '../pages/dashboards/DesignerDashboardPage';
import MyContentPage from '../pages/dashboards/MyContentPage';
import DesignerAnalyticsPage from '../pages/dashboards/DesignerAnalyticsPage'; 
import DesignerProfilePage from '../pages/dashboards/DesignerProfilePage'; 

// --- ROUTING LOGIC COMPONENTS ---
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

const PublicLayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

// --- MAIN ROUTER ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* === PUBLIC ROUTES === */}
      <Route element={<PublicLayoutWrapper />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
      </Route>

      {/* === AUTH ROUTES === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp/:userId" element={<OtpVerificationPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* === PROTECTED ROUTES === */}
      <Route element={<ProtectedRouteLogic />}>
        <Route path="/dashboard" element={<DashboardGateway />} />

        <Route element={<MainLayout><Outlet /></MainLayout>}>
          <Route path="/style-quiz" element={<StyleQuizPage />} />
          <Route path="/ar-preview" element={<ArPreviewPage />} />
        </Route>

        <Route path="/visualizer" element={<AiVisualizerPage />} />
        <Route path="/visualizer/:designId" element={<AiVisualizerPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />

        {/* === ADMIN ROUTES === */}
         <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="approvals" element={<DesignerApprovals />} />
          <Route path="content" element={<ContentModeration />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="email-templates" element={<EmailTemplatesPage />} /> 
          <Route path="feature-flags" element={<FeatureFlagsPage />} />
          <Route path="portfolio" element={<PortfolioManagement />} /> 
          <Route path="payment-settings" element={<PaymentSettingsPage />} />
        </Route>

        {/* === USER ROUTES === */}
        <Route path="/user" element={<UserDashboardLayout />}>
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="designs" element={<MyDesignsPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="consultations" element={<ConsultationsPage />} />
          <Route path="consultations/:consultationId" element={<ConsultationDetailPage />} />
          <Route path="designers" element={<DesignersListPage />} />
        </Route>

        {/* === DESIGNER ROUTES === */}
        <Route path="/designer" element={<UserDashboardLayout />}>
          <Route path="dashboard" element={<DesignerDashboardPage />} />
          <Route path="content" element={<MyContentPage />} />
          <Route path="analytics" element={<DesignerAnalyticsPage />} /> 
          <Route path="profile" element={<DesignerProfilePage />} /> 
          <Route path="consultations/:consultationId" element={<ConsultationDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;