// src/pages/PremiumUserDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Corrected Path
import MainLayout from '../components/layout/MainLayout'; // Wraps the page
import Card from '../components/ui/Card';
import Button from '../components/common/Button';
import TabSwitcher from '../components/ui/TabSwitcher';
import SavedDesigns from '../features/userProfile/SavedDesigns'; // Using placeholder
import PaymentHistory from '../features/payment/PaymentHistory'; // Using placeholder
import { FaCrown, FaLightbulb, FaMagic, FaCalendarCheck, FaCheckCircle } from 'react-icons/fa';

// This is the component logic you provided
const PremiumUserDashboardComponent = () => {
  const { user } = useAuth();

  const recentActivity = [
    { id: 1, type: 'Design Saved', desc: 'Modern Living Room', link: '#' },
    { id: 2, type: 'AR Session', desc: 'Tried new sofa', link: '#' },
    { id: 3, type: 'Consultation Booked', desc: 'With Designer Anya S.', link: '#' },
  ];

  const dashboardTabs = [
    {
      title: 'Overview',
      content: (
        <div className="py-4">
          <h2 className="text-2xl font-semibold text-neutral-dark mb-4">Exclusive Premium Features</h2>
          {/* ... The rest of your overview content ... */}
          <p>Overview content goes here.</p>
        </div>
      ),
    },
    { title: 'My Designs', content: <SavedDesigns /> },
    { title: 'Payment History', content: <PaymentHistory /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-dark">Premium Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {user?.name || 'Premium User'}! <FaCrown className="inline text-accent-gold ml-1" /></p>
        </div>
        <img src={user?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-primary-teal" />
      </div>
      <TabSwitcher tabs={dashboardTabs} />
    </motion.div>
  );
};

// The final page component that gets exported
const PremiumUserDashboardPage = () => {
    return (
        <MainLayout>
            <PremiumUserDashboardComponent />
        </MainLayout>
    );
}

export default PremiumUserDashboardPage;