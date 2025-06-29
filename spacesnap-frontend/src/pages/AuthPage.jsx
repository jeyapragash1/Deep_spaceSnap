// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from '../features/auth/LoginForm';
import RegisterForm from '../features/auth/RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-teal">SpaceSnap</h1>
          <p className="text-neutral-dark mt-2">
            {isLoginView ? 'Log in to continue your design journey.' : 'Join us and start designing today!'}
          </p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={isLoginView ? 'login' : 'register'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {isLoginView ? ( <LoginForm onSwitchToRegister={() => setIsLoginView(false)} /> ) : ( <RegisterForm onSwitchToLogin={() => setIsLoginView(true)} /> )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default AuthPage;