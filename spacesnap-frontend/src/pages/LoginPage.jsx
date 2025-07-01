// src/pages/LoginPage.jsx
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        // Use the mock login function from our AuthContext
        login();
        // After logging in, redirect the user to their dashboard
        navigate('/dashboard');
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">Login</h1>
                <p className="text-gray-600 mb-8">This is a placeholder login page. Click the button to simulate logging in as a user.</p>
                <Button onClick={handleLogin} className="px-8 py-3 text-lg">
                    Log In (as a mock user)
                </Button>
            </div>
        </MainLayout>
    );
};

export default LoginPage;