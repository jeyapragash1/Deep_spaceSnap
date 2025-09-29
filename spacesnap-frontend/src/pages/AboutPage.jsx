// src/pages/AboutPage.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaMagic, FaCouch, FaUniversity, FaUsers } from 'react-icons/fa';

const AboutPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const featureCard = (icon, title, text) => (
    <motion.div variants={fadeIn} className="text-center p-6">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </motion.div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn}>
      {/* --- HEADER SECTION --- */}
      <header
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2127&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Reimagining Your Space
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="text-xl mt-4 max-w-2xl mx-auto"
          >
            We're bridging the gap between imagination and reality with cutting-edge AI and AR technology.
          </motion.p>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-24">

          {/* --- HOW IT WORKS --- */}
          <section className="text-center max-w-4xl mx-auto mb-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Unique Process</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-12">
                SpaceSnap transforms interior design from a guessing game into an exciting creative journey. Our innovative three-step process makes it simple to see your vision come to life.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {featureCard(<FaCamera className="text-blue-500" size={32} />, "1. Scan Your Space", "Start by taking a quick scan of your room with your device's camera. Our app captures multiple images to understand your space's layout and lighting.")}
                {featureCard(<FaMagic className="text-purple-500" size={32} />, "2. Reimagine with AI", "Select your best photo and tell our AI what you envision. From 'modern minimalist' to 'cozy bohemian,' it generates a stunning new version of your room in seconds.")}
                {/* --- THIS IS THE FIXED LINE --- */}
                {featureCard(<FaCouch className="text-green-500" size={32} />, "3. Visualize in AR", "Inspired by your new design? Take 3D models of real furniture and place them in your actual room using Augmented Reality to check the fit and style.")}
                {/* --- END OF FIX --- */}
              </div>
            </motion.div>
          </section>

          

        </div>
      </div>
    </motion.div>
  );
};

export default AboutPage;