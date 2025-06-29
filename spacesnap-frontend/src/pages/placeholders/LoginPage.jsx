// src/pages/placeholders/LoginPage.jsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const LoginPage = () => {
  return (
    <MainLayout isLoggedIn={false}>
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold">Log In</h1>
        <p className="mt-4 text-lg">A login form will be here.</p>
      </div>
    </MainLayout>
  );
};
export default LoginPage;