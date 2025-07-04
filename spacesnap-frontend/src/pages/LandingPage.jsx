// src/pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Card from '../components/ui/Card';
import { FaArrowRight, FaPaintRoller, FaCube, FaPuzzlePiece } from 'react-icons/fa';

// --- LOCAL IMAGE IMPORTS (These are correct) ---
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

// --- The 'import heroVideo' line has been completely REMOVED. ---

const ScrollParallax = ({ children, offset = ['0%', '20%'], className = '' }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], offset), { stiffness: 100, damping: 30 });
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
};

const HeroSection = () => (
  <section className="relative h-[calc(100vh-64px)] flex items-center justify-center text-center overflow-hidden">
    
    {/* --- THIS IS THE FIX --- */}
    {/* The 'src' attribute now points directly to the public path: "/hero-video.mp4". */}
    <video 
      src="/hero-video.mp4" 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="absolute top-0 left-0 w-full h-full object-cover z-0" 
    />
    
    <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
    <div className="relative z-20 text-white p-4">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl md:text-7xl font-extrabold mb-4">
        Design Your Space In A Snap!
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="text-xl md:text-2xl mb-8">
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

const FeaturesOverviewSection = () => (
  <section className="py-20 bg-neutral-light text-center">
    <ScrollParallax>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-neutral-dark mb-4">Everything You Need To Design</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">From inspiration to realization, our platform provides a complete suite of tools to bring your vision to life.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <Card><FaPuzzlePiece className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Style Quiz</h3><p className="text-gray-600">Discover your unique design personality.</p></Card>
          <Card><FaPaintRoller className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">AI Visualizer</h3><p className="text-gray-600">Instantly see new colors and floors in your room.</p></Card>
          <Card><FaCube className="text-primary-teal text-5xl mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">AR Preview</h3><p className="text-gray-600">Place true-to-scale 3D furniture in your space.</p></Card>
        </div>
      </div>
    </ScrollParallax>
  </section>
);

const FeaturePromo = ({ image, title, description, link, linkText, reverse = false }) => (
  <section className="py-20 bg-white">
    <ScrollParallax offset={['0%', '10%']}>
      <div className={`container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="md:w-1/2">
          <img src={image} alt={title} className="rounded-xl shadow-2xl w-full h-auto" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold text-neutral-dark mb-4">{title}</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">{description}</p>
          <Link to={link} className="inline-flex items-center gap-2 font-bold text-primary-teal hover:underline text-lg">
            {linkText} <FaArrowRight />
          </Link>
        </motion.div>
      </div>
    </ScrollParallax>
  </section>
);

const PortfolioSection = () => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const x1 = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
    const x2 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    return (
        <section ref={ref} className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold text-neutral-dark mb-4">Inspiration Gallery</h2>
                <p className="text-lg text-gray-600 mb-12">See what's possible with our community of designers.</p>
                <div className="space-y-4">
                    <motion.div style={{ x: x1 }} className="flex gap-4">
                        {[img4, img5, img6, img7].map((i, idx) => (
                            <img key={idx} src={i} className="h-48 md:h-64 w-auto rounded-lg shadow-md" alt="portfolio" />
                        ))}
                    </motion.div>
                    <motion.div style={{ x: x2 }} className="flex gap-4">
                        {[img8, img9, img10, img11].map((i, idx) => (
                            <img key={idx} src={i} className="h-48 md:h-64 w-auto rounded-lg shadow-md" alt="portfolio" />
                        ))}
                    </motion.div>
                </div>
                <Link to="/portfolio" className="mt-12 inline-block bg-primary-teal text-white px-8 py-3 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90">
                    Explore All Portfolios
                </Link>
            </div>
        </section>
    );
};


const FinalInfoSection = () => (
  <section className="relative py-24 bg-white">
    <div className="absolute inset-0 z-0">
      <img src={img1} className="w-full h-full object-cover opacity-10" alt="background texture" />
    </div>
    <div className="container mx-auto px-4 relative z-10">
      <div className="bg-white lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative sm:py-16 lg:py-0">
          <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20">
            <div className="relative pt-[60%] md:pt-[70%] lg:pt-[80%] rounded-2xl shadow-xl overflow-hidden">
              <img className="absolute inset-0 w-full h-full object-cover" src={img12} alt="Team" />
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
          <div className="pt-12 sm:pt-16 lg:pt-20">
            <h2 className="text-3xl text-neutral-dark font-extrabold tracking-tight sm:text-4xl">
              About Our Mission
            </h2>
            <div className="mt-6 text-gray-600 space-y-6">
              <p className="text-lg">
                SpaceSnap is developed by Group No: 10, a passionate team of IT students from Uva Wellassa University of Sri Lanka. We are driven by a shared enthusiasm for technology and a commitment to solving real-world design frustrations.
              </p>
            </div>
            <div className="mt-10">
              <h3 className="text-2xl font-bold text-neutral-dark mb-4">Have Questions?</h3>
              <p className="text-lg text-gray-600 mb-6">Our team is here to help. Reach out and let's create something beautiful together.</p>
              <Link to="/contact" className="inline-block bg-accent-gold text-white px-8 py-3 text-lg rounded-lg font-semibold shadow-lg hover:bg-opacity-90">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const LandingPage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesOverviewSection />
      <FeaturePromo image={img1} title="Find Your Perfect Style" description="Not sure where to start? Our interactive Style Quiz analyzes your preferences to uncover your unique design personality, from Modern Minimalist to Bohemian Chic." link="/style-quiz" linkText="Take the Style Quiz" />
      <FeaturePromo image={img2} title="Visualize Changes Instantly" description="Upload a photo of your room and let our AI do the heavy lifting. Experiment with wall colors, floor textures, and ceiling designs in seconds." link="/visualizer" linkText="Try the AI Visualizer" reverse />
      <FeaturePromo image={img3} title="See It In Your Room with AR" description="Use your phone's camera to place true-to-scale 3D models of furniture right in your space. No more guessing if that sofa will fit!" link="/ar-preview" linkText="Experience AR Preview" />
      <PortfolioSection />
      <FinalInfoSection />
    </>
  );
};

export default LandingPage;