// src/pages/placeholders/PortfolioPage.jsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const PortfolioPage = () => {
  return (
    <MainLayout isLoggedIn={false}>
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Portfolio</h1>
        <p className="mt-4 text-lg">This page will showcase a gallery of beautiful designs.</p>
      </div>
    </MainLayout>
  );
};
export default PortfolioPage;