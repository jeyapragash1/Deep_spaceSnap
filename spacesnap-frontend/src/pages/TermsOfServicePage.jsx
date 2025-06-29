// src/pages/TermsOfServicePage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 text-gray-700 leading-relaxed"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-primary-teal text-center mb-10">
        Terms of Service
      </h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-neutral-dark mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the SpaceSnap website...</p>
      </section>
      {/* ... rest of the component from your sample ... */}
    </motion.div>
  );
};
export default TermsOfServicePage;