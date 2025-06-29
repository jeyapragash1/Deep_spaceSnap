// src/pages/placeholders/FeaturesPage.jsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const FeaturesPage = () => {
  return (
    <MainLayout isLoggedIn={false}> {/* Assuming guest view for now */}
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Our Features</h1>
        <p className="mt-4 text-lg">This page will detail the Style Quiz, AI Visualizer, and AR Integration.</p>
      </div>
    </MainLayout>
  );
};
export default FeaturesPage;