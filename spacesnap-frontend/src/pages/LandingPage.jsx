// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card'; // Make sure this file exists at src/components/ui/Card.jsx
import { FaPaintRoller, FaCube, FaPuzzlePiece, FaUpload, FaPalette, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';
import heroBg from '../assets/images/hero-bg.jpg'; // Make sure this image exists

// --- HERO SECTION ---
const HeroSection = () => (
    <section className="relative h-[calc(100vh-64px)] flex items-center justify-center text-center bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-white p-4">
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl font-extrabold mb-4">
                Design Your Space In A Snap!
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl md:text-2xl mb-8">
                Visualize, Plan, and Transform Your Home with AI & AR.
            </motion.p>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
                <Link to="/visualizer">
                    <button className="bg-accent-gold text-white px-8 py-4 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90">
                        Start Designing Now
                    </button>
                </Link>
            </motion.div>
        </div>
    </section>
);

// --- ABOUT US SECTION ---
const AboutUsSection = () => (
    <section className="py-20 bg-neutral-light text-center">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-neutral-dark mb-12">Discover SpaceSnap</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <Card><FaPaintRoller className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Instant AI Visualization</h3><p className="text-gray-600">Upload photos to see how new paint and furniture look.</p></Card>
                <Card><FaCube className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Real-Time AR Preview</h3><p className="text-gray-600">Project 3D furniture into your space to check fit and style.</p></Card>
                <Card><FaPuzzlePiece className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Personalized Style Guidance</h3><p className="text-gray-600">Take our quiz to get tailored recommendations.</p></Card>
            </div>
        </div>
    </section>
);

// --- HOW IT WORKS SECTION ---
const ServicesSection = () => (
    <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-neutral-dark mb-12">How It Works</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10">
                <Card className="w-full md:w-1/3"><FaUpload className="text-primary-teal text-6xl mx-auto mb-4" /><h3 className="text-2xl font-semibold mb-2">1. Upload Your Room</h3><p className="text-gray-600">Snap a photo of your space.</p></Card>
                <Card className="w-full md:w-1/3"><FaPalette className="text-primary-teal text-6xl mx-auto mb-4" /><h3 className="text-2xl font-semibold mb-2">2. Design with AI & AR</h3><p className="text-gray-600">Experiment with our smart tools.</p></Card>
                <Card className="w-full md:w-1/3"><FaCheckCircle className="text-primary-teal text-6xl mx-auto mb-4" /><h3 className="text-2xl font-semibold mb-2">3. Realize Your Vision</h3><p className="text-gray-600">Save, share, and create.</p></Card>
            </div>
        </div>
    </section>
);

// --- TESTIMONIALS SECTION ---
const TestimonialsSection = () => {
    const testimonials = [
        { name: 'Sarah L.', role: 'Homeowner', quote: 'SpaceSnap made redecorating so easy! Seeing the changes instantly saved us from costly mistakes.' },
        { name: 'Mark R.', role: 'Interior Designer', quote: 'Communicating design concepts to clients used to be a challenge. With SpaceSnap, it\'s a game-changer.' },
        { name: 'Jessica B.', role: 'DIY Enthusiast', quote: 'The AI Visualizer and Style Quiz are incredibly intuitive and fun to use!' },
    ];
    return (
        <section className="py-20 bg-neutral-light text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-neutral-dark mb-12">What Our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(t => (
                        <Card key={t.name}>
                            <FaQuoteLeft className="text-primary-teal text-3xl mb-4 mx-auto" />
                            <p className="text-gray-700 italic mb-6">"{t.quote}"</p>
                            <div className="mt-auto">
                                <h4 className="font-semibold">{t.name}</h4>
                                <p className="text-gray-600 text-sm">{t.role}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};


// --- The Final Page Component ---
const LandingPage = () => {
  return (
    // We wrap it in our MainLayout to get the Navbar and Footer
    <MainLayout>
      <HeroSection />
      <AboutUsSection />
      <ServicesSection />
      <TestimonialsSection />
    </MainLayout>
  );
};

export default LandingPage;