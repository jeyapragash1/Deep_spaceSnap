// src/pages/TermsOfServicePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaFileContract, FaUser, FaCloudUploadAlt, FaBan } from 'react-icons/fa';

// --- We have REMOVED the import for MainLayout from this file ---

// --- A new image for the header background ---
// Make sure you have an image at this path, e.g., your '18.jpg'
import termsBg from '../assets/images/18.jpg';

// Helper component for styling sections, consistent with the Privacy Policy page
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

const TermsOfServicePage = () => {
    // The <MainLayout> wrapper has been removed from here.
    // The router is now responsible for adding it.
    return (
        <>
            {/* --- NEW HEADER SECTION --- */}
            <header className="relative h-[40vh] bg-cover bg-center" style={{ backgroundImage: `url(${termsBg})` }}>
                <div className="absolute inset-0 bg-neutral-dark bg-opacity-60 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-5xl md:text-7xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>Terms of Service</h1>
                        <p className="text-xl mt-2">The Rules of Our House</p>
                    </div>
                </div>
            </header>
            
            {/* --- MAIN CONTENT --- */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-20 max-w-4xl">
                    <p className="text-center text-gray-500 mb-12">Last Updated: July 4, 2025</p>

                    <PolicySection title="Agreement to Terms" icon={<FaFileContract size={24} />}>
                        <p>By using the SpaceSnap website and its services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you do not have permission to access the Service.</p>
                    </PolicySection>

                    <PolicySection title="User Accounts" icon={<FaUser size={24} />}>
                        <p>When you create an account with us, you guarantee that you are above the age of 18 and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.</p>
                    </PolicySection>

                    <PolicySection title="User Content" icon={<FaCloudUploadAlt size={24} />}>
                        <p>Our Service allows you to post, link, store, share, and otherwise make available certain information, images, or other material ("User Content"). You are responsible for the User Content that you post, including its legality, reliability, and appropriateness. By posting User Content, you grant us the right and license to use, modify, and distribute such Content on and through the Service for the purpose of operating and providing the Service to you and to other users.</p>
                    </PolicySection>

                    <PolicySection title="Termination" icon={<FaBan size={24} />}>
                        <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
                    </PolicySection>

                </div>
            </div>
        </>
    );
};

export default TermsOfServicePage;