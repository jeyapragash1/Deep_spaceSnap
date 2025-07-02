// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import { FaArrowRight, FaPaintRoller, FaCube, FaPuzzlePiece } from 'react-icons/fa';

// --- FINAL, CORRECTED LOCAL ASSET IMPORTS ---
// The video is now imported from the 'images' folder, matching your file structure.
import heroVideo from '../assets/videos/hero-video.mp4.mp4'; 
// All 12 images are imported from the 'images' folder.
import img1 from '../assets/images/1.jpg';
import img2 from '../assets/images/2.jpg';
import img3 from '../assets/images/3.jpg';
import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.jpg';
import img6 from '../assets/images/6.jpg';
import img7 from '../assets/images/7.jpg';
import img8 from '../assets/images/8.jpg';
import img9 from '../assets/images/9.jpg';
import img10 from '../assets/images/10.jpg';
import img11 from '../assets/images/11.jpg';
import img12 from '../assets/images/12.jpg';


// --- SECTION 1: HERO WITH VIDEO BACKGROUND ---
const HeroSection = () => (
    <section className="relative h-[calc(100vh-64px)] flex items-center justify-center text-center overflow-hidden">
        <video 
            src={heroVideo}
            autoPlay loop muted playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
        <div className="relative z-20 text-white p-4">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} 
                className="text-5xl md:text-7xl font-extrabold mb-4" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
            >
                Design Your Space In A Snap!
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} 
                className="text-xl md:text-2xl mb-8" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
            >
                Visualize, Plan, and Transform Your Home with AI & AR.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
                <Link to="/register" className="bg-accent-gold text-white px-8 py-4 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform">
                    Get Started For Free
                </Link>
            </motion.div>
        </div>
    </section>
);


// --- SECTION 2: KEY FEATURES OVERVIEW ---
const FeaturesOverviewSection = () => (
    <section className="py-20 bg-neutral-light text-center">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-neutral-dark mb-4">Everything You Need To Design</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">From inspiration to realization, our platform provides a complete suite of tools to bring your vision to life.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <Card><FaPuzzlePiece className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Style Quiz</h3><p className="text-gray-600">Discover your unique design personality.</p></Card>
                <Card><FaPaintRoller className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">AI Visualizer</h3><p className="text-gray-600">Instantly see new colors and floors in your room.</p></Card>
                <Card><FaCube className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">AR Preview</h3><p className="text-gray-600">Place true-to-scale 3D furniture in your space.</p></Card>
            </div>
        </div>
    </section>
);


// --- SECTION 3: DETAILED FEATURE PROMOS (ZIG-ZAG LAYOUT) ---
const FeaturePromo = ({ image, title, description, link, linkText, reverse = false }) => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className={`flex flex-col md:flex-row items-center gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
                <motion.div initial={{ opacity: 0, x: reverse ? 50 : -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="md:w-1/2">
                    <img src={image} alt={title} className="rounded-lg shadow-2xl w-full h-auto" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-4xl font-bold text-neutral-dark mb-4">{title}</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{description}</p>
                    <Link to={link} className="inline-flex items-center gap-2 font-bold text-primary-teal hover:underline text-lg">
                        {linkText} <FaArrowRight />
                    </Link>
                </motion.div>
            </div>
        </div>
    </section>
);


// --- SECTION 4: PORTFOLIO SHOWCASE ---
const PortfolioSection = () => (
    <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-neutral-dark mb-4">Inspiring Designs</h2>
            <p className="text-lg text-gray-600 mb-12">Explore portfolios from our talented community of designers.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[img4, img5, img6, img7, img8, img9, img10, img11].map((img, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} className="overflow-hidden rounded-lg shadow-lg">
                        <img src={img} alt={`Portfolio image ${index + 1}`} className="w-full h-full object-cover"/>
                    </motion.div>
                ))}
            </div>
             <Link to="/portfolio" className="mt-12 inline-block bg-primary-teal text-white px-8 py-3 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90">
                View All Portfolios
            </Link>
        </div>
    </section>
);


// --- SECTION 5: ABOUT US SUMMARY ---
const AboutUsSection = () => (
     <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-bold text-neutral-dark mb-4">About SpaceSnap</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                SpaceSnap is developed by Group No: 10, a passionate team of Industrial Information Technology students from Uva Wellassa University of Sri Lanka. Our mission is to democratize interior design by leveraging cutting-edge AI and AR to bridge the gap between imagination and reality.
            </p>
             <Link to="/about" className="font-bold text-primary-teal hover:underline text-lg">
                Learn More About Our Journey
            </Link>
        </div>
    </section>
);


// --- SECTION 6: CONTACT CALL TO ACTION ---
const ContactCTASection = () => (
    <section className="py-20 bg-neutral-dark text-white">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Have Questions?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">Our team is here to help you get started on your design journey. Don't hesitate to reach out.</p>
            <Link to="/contact" className="bg-accent-gold text-white px-8 py-4 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90 transform hover:scale-105 transition-transform">
                Contact Us
            </Link>
        </div>
    </section>
);


// --- THE FINAL PAGE COMPONENT ---
// This component assembles all the sections in the correct order.
const LandingPage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesOverviewSection />
      
      {/* Detailed Feature Promotions using our reusable component and your local images */}
      <FeaturePromo 
        image={img1} 
        title="Find Your Perfect Style"
        description="Not sure where to start? Our interactive Style Quiz analyzes your preferences to uncover your unique design personality, from Modern Minimalist to Bohemian Chic."
        link="/style-quiz"
        linkText="Take the Style Quiz"
      />
      <FeaturePromo 
        image={img2}
        title="Visualize Changes Instantly"
        description="Upload a photo of your room and let our AI do the heavy lifting. Experiment with wall colors, floor textures, and ceiling designs in seconds."
        link="/visualizer"
        linkText="Try the AI Visualizer"
        reverse={true} // This makes the layout zig-zag
      />
      <FeaturePromo 
        image={img3}
        title="See It In Your Room with AR"
        description="Use your phone's camera to place true-to-scale 3D models of furniture right in your space. No more guessing if that sofa will fit!"
        link="/ar-preview"
        linkText="Experience AR Preview"
      />

      <PortfolioSection />
      <AboutUsSection />
      <ContactCTASection />
    </MainLayout>
  );
};

export default LandingPage;