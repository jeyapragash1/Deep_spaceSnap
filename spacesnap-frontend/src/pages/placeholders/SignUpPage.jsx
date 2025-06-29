// src/pages/placeholders/SignUpPage.jsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const SignUpPage = () => {
  return (
    <MainLayout isLoggedIn={false}>
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <p className="mt-4 text-lg">A registration form will be here.</p>
      </div>
    </MainLayout>
  );
};
export default SignUpPage;