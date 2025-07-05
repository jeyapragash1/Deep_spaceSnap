// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaInfoCircle, FaUserLock, FaDatabase } from 'react-icons/fa';

// --- We have REMOVED the import for MainLayout from this file ---

// --- A new image for the header background ---
// Make sure you have an image at this path, e.g., your '17.jpg'
import policyBg from '../assets/images/17.jpg';

// Helper component for styling sections
const PolicySection = ({ title, icon, children }) => (
    <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
    >
        <div className="flex items-center mb-4">
            <div className="bg-primary-teal text-white p-3 rounded-md mr-4">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-neutral-dark">{title}</h2>
        </div>
        <div className="prose lg:prose-lg max-w-none pl-16">
            {children}
        </div>
    </motion.section>
);


const PrivacyPolicyPage = () => {
    // The <MainLayout> wrapper has been removed from here.
    // The router is now responsible for adding it.
    return (
        <>
            {/* --- NEW HEADER SECTION --- */}
            <header className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: `url(${policyBg})` }}>
                <div className="absolute inset-0 bg-neutral-dark bg-opacity-60 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl md:text-7xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>Privacy Policy</h1>
                        <p className="text-xl mt-2">Your Trust and Security Are Our Priority</p>
                    </div>
                </div>
            </header>
            
            {/* --- MAIN CONTENT --- */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-20 max-w-4xl">
                    <p className="text-center text-gray-500 mb-12">Last Updated: July 4, 2025</p>

                    <PolicySection title="Introduction" icon={<FaInfoCircle size={24} />}>
                        <p>Welcome to SpaceSnap ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully.</p>
                    </PolicySection>

                    <PolicySection title="Information We Collect" icon={<FaDatabase size={24} />}>
                        <p>We may collect information about you in a variety of ways:</p>
                        <ul>
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number that you voluntarily give to us when you register with the Site.</li>
                            <li><strong>Uploaded Images:</strong> Images of your rooms that you upload to use our AI Visualizer feature. These images are processed to provide the service and are not used for any other purpose without your explicit consent.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, and operating system.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="Use of Your Information" icon={<FaUserLock size={24} />}>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                        <ul>
                            <li>Create and manage your account.</li>
                            <li>Process your transactions and deliver the services you requested.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Monitor and analyze usage and trends to improve our website and services.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection title="Security of Your Information" icon={<FaShieldAlt size={24} />}>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                    </PolicySection>

                </div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;