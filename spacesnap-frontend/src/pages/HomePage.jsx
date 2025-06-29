// src/pages/HomePage.jsx
import React from 'react';
import HeroSection from '../features/landing/HeroSection';
import ProjectSection from '../features/landing/ProjectSection';

const HomePage = () => {
  return (
    // This page will be composed of sections.
    <div>
      <HeroSection />
      <ProjectSection />
      {/* You can add more sections like AboutUsSection here later */}
    </div>
  );
};
export default HomePage;