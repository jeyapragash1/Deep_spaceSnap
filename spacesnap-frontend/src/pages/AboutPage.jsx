// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaLightbulb, FaRocket } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-primary-teal text-center mb-10">
        About SpaceSnap
      </h1>

      <section className="mb-12 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-neutral-dark mb-4">Our Mission</h2>
        <FaRocket className="text-accent-gold text-6xl mx-auto mb-4" />
        <p className="text-lg text-gray-700 leading-relaxed">
          At SpaceSnap, our mission is to democratize interior design. We believe that everyone should have the power to visualize and create their dream living spaces, regardless of their design expertise or budget. By leveraging cutting-edge Artificial Intelligence and Augmented Reality, we bridge the gap between imagination and reality, making design accessible, intuitive, and fun.
        </p>
      </section>

      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-neutral-dark mb-8">Meet The Team</h2>
        <FaUsers className="text-accent-gold text-6xl mx-auto mb-4" />
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          SpaceSnap is developed by Group No: 10, a passionate team of Industrial Information Technology students from Uva Wellassa University of Sri Lanka. We are driven by a shared enthusiasm for technology and a commitment to solving real-world design frustrations.
        </p>
        <p className="text-md text-gray-600">
          Supervisors: Mr. H.P.D.P. Pathirana, Mr. S.S. Prajish
        </p>
      </section>
    </motion.div>
  );
};

export default AboutPage;