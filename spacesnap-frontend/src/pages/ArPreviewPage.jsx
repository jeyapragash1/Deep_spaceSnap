// src/pages/ArPreviewPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const ArPreviewPage = () => {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-primary-teal mb-4">
                    Augmented Reality Preview
                </h1>
                <p className="text-lg text-gray-700">
                    This feature is coming soon! Use your phone's camera to place 3D furniture right in your room.
                </p>
            </div>
        </MainLayout>
    );
};

export default ArPreviewPage;