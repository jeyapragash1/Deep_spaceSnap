// src/pages/FeaturesPage.jsx
import React from 'react';
import { FaPaintBrush, FaMagic, FaCube } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <FaPaintBrush className="w-12 h-12 text-blue-500" />,
    title: 'Personalized Style Quiz',
    description: 'Answer a few simple questions to discover your unique interior design style. We’ll provide personalized recommendations to get you started.',
  },
  {
    icon: <FaMagic className="w-12 h-12 text-green-500" />,
    title: 'AI Room Visualizer',
    description: 'Upload a photo of your room and let our AI do the magic. Instantly see how new wall colors and furniture will look in your actual space.',
  },
  {
    icon: <FaCube className="w-12 h-12 text-purple-500" />,
    title: 'Augmented Reality (AR) View',
    description: 'Use your phone’s camera to place true-to-scale 3D models of furniture in your room. Walk around and see it from every angle.',
  },
];

const FeaturesPage = () => {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800">Our Core Features</h1>
          <p className="text-gray-600 mt-2">The tools that power your design journey.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-gray-50 p-8 rounded-lg shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;