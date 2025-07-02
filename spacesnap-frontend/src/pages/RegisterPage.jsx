// src/pages/RegisterPage.jsx
import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import AuthForm from '../features/auth/AuthForm';

const RegisterPage = () => {
    // This page also renders the AuthForm.
    // The AuthForm component itself handles the logic for which view to show.
    // For a better user experience, we could pass a prop to default to the register view,
    // but the current setup works well as the component is self-contained.
    return (
        <AuthLayout>
            <AuthForm />
        </AuthLayout>
    );
};

export default RegisterPage;