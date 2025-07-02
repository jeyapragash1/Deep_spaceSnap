// src/pages/TermsOfServicePage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
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
                        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark">Terms of Service</h1>
                        <p className="text-gray-500 mt-2">Last Updated: [Date]</p>
                    </div>

                    <div className="prose lg:prose-lg max-w-none">
                        <h2>1. Agreement to Terms</h2>
                        <p>By using the SpaceSnap website and its services (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you do not have permission to access the Service.</p>

                        <h2>2. User Accounts</h2>
                        <p>When you create an account with us, you guarantee that you are above the age of 18 and that the information you provide us is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.</p>

                        <h2>3. User Content</h2>
                        <p>Our Service allows you to post, link, store, share, and otherwise make available certain information, images, or other material ("User Content"). You are responsible for the User Content that you post on or through the Service, including its legality, reliability, and appropriateness. By posting User Content, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service for the purpose of operating and providing the Service to you and to other users.</p>

                        <h2>4. Termination</h2>
                        <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
};

export default TermsOfServicePage;