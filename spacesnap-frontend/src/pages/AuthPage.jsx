// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from '../features/auth/LoginForm';
import RegisterForm from '../features/auth/RegisterForm';
import { FaGoogle } from 'react-icons/fa';
import Button from '../components/common/Button';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-teal">SpaceSnap</h1>
        </div>

        {/* Simple conditional rendering - NO ANIMATION */}
        {isLoginView ? (
          <LoginForm onSwitchToRegister={() => setIsLoginView(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} />
        )}

        {/* Google Login Button */}
        <div className="mt-6 w-full text-center">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">OR</span></div>
            </div>
            <Button variant="outline" className="w-full flex items-center justify-center">
              <FaGoogle className="mr-3 text-lg" /> Continue with Google
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;