// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // We will use the new login function from our context
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const { email, password } = formData;
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await login(email, password); // Call the context's login function
            navigate('/dashboard'); // Redirect to dashboard gateway on success
        } catch (err) {
            setError(err.message); // The context will handle passing the error message
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-16 flex justify-center">
                 <div className="w-full max-w-md">
                    <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h1 className="text-3xl font-bold mb-6 text-center">Log In</h1>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="email" type="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password" type="password" name="password" value={password} onChange={onChange} required />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-primary-teal hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Sign In
                            </button>
                            <Link className="inline-block align-baseline font-bold text-sm text-primary-teal hover:text-opacity-80" to="/register">
                                Don't have an account?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoginPage;