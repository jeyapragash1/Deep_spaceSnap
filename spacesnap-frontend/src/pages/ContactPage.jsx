import React from 'react';
import MainLayout from '../components/layout/MainLayout';

const ContactPage = () => {
  return (
    <MainLayout>
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="mt-4">Contact form and information will go here.</p>
        </div>
    </MainLayout>
  );
};

export default ContactPage;