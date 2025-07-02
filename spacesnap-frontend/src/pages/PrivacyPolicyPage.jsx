// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
    return (
        <MainLayout>
            <div className="bg-white py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto px-4 max-w-4xl"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark">Privacy Policy</h1>
                        <p className="text-gray-500 mt-2">Last Updated: [Date]</p>
                    </div>
                    
                    {/* The 'prose' class from Tailwind provides beautiful typography for text-heavy content */}
                    <div className="prose lg:prose-lg max-w-none">
                        <h2>1. Introduction</h2>
                        <p>Welcome to SpaceSnap ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this policy carefully.</p>
                        
                        <h2>2. Information We Collect</h2>
                        <p>We may collect information about you in a variety of ways:</p>
                        <ul>
                            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site.</li>
                            <li><strong>Uploaded Images:</strong> Images of your rooms that you upload to use our AI Visualizer feature. These images are processed to provide the service and are not used for any other purpose without your explicit consent.</li>
                            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, and operating system.</li>
                        </ul>

                        <h2>3. Use of Your Information</h2>
                        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
                        <ul>
                            <li>Create and manage your account.</li>
                            <li>Process your transactions and deliver the services you requested.</li>
                            <li>Email you regarding your account or order.</li>
                            <li>Improve our website and services.</li>
                        </ul>
                        
                        <h2>4. Security of Your Information</h2>
                        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};

export default PrivacyPolicyPage;