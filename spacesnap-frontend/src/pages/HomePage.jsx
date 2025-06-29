import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const HomePage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800">
          Welcome to SpaceSnap
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          This is your starting point. All content for the home page will go here.
        </p>
        <div className="mt-8">
          <button className="bg-teal-600 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
      {/* You can add more sections for your homepage here */}
      <div style={{ height: '600px' }} className="bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">Another section of the page</p>
      </div>
    </MainLayout>
  );
};

export default HomePage;