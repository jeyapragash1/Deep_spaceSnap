// src/pages/LoginPage.jsx
import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import AuthForm from '../features/auth/AuthForm';

const LoginPage = () => {
    
    return (
        <AuthLayout>
            <AuthForm />
        </AuthLayout>
    );
};

export default LoginPage;