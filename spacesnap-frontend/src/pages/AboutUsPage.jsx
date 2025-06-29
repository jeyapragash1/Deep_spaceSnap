// src/pages/AboutUsPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';

// This is the main component from your file
const AboutUsContent = () => {
  return (
    <motion.div /* ... Paste your AboutUsPage component code here ... */ >
        {/* ... The rest of the content ... */}
    </motion.div>
  );
};

// We wrap it in the MainLayout to give it the Navbar and Footer
const AboutUsPage = () => {
    return (
        <MainLayout>
            <AboutUsContent />
        </MainLayout>
    );
};

export default AboutUsPage;