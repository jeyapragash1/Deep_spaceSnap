// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Make sure you have axios installed (npm install axios)

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });
    const [error, setError] = useState('');

    const { name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }
        try {
            // Make the API call to our backend
            await axios.post('http://localhost:5000/api/users/register', { name, email, password });
            // If successful, redirect to login page
            navigate('/login');
        } catch (err) {
            setError(err.response.data.msg || 'Registration failed');
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="w-full max-w-md">
                    <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="name" type="text" name="name" value={name} onChange={onChange} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="email" type="email" name="email" value={email} onChange={onChange} required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password" type="password" name="password" value={password} onChange={onChange} minLength="6" required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">Confirm Password</label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="password2" type="password" name="password2" value={password2} onChange={onChange} minLength="6" required />
                        </div>
                        <div className="flex items-center justify-between">
                            <button className="bg-primary-teal hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Register
                            </button>
                            <Link className="inline-block align-baseline font-bold text-sm text-primary-teal hover:text-opacity-80" to="/login">
                                Already have an account?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default RegisterPage;