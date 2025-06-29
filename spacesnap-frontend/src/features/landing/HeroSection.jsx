// src/features/landing/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center text-center bg-gray-800 text-white p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight mb-4">
          Design Your Space In A Snap!
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl mb-8 font-light">
          Visualize, Plan, and Transform Your Home with AI & AR.
        </motion.p>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
          <Link to="/signup">
            <button className="bg-accent-gold text-white px-8 py-4 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90 transition-all duration-300">
              Start Designing Now
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
export default HeroSection;