// src/features/auth/AuthForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';

const formVariants = { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 } };
const Input = ({ name, type, placeholder, icon, value, onChange, required = true }) => (
    <div className="relative mb-4"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span><input name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal" /></div>
);

const AuthForm = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phoneNumber: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginChange = e => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = e => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            // --- THE FIX ---
            // Just call login. DO NOT navigate. The AuthRedirector will handle it.
            await login(loginData.email, loginData.password);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            setLoading(false); // Make sure to stop loading on error
        }
        // We no longer set loading to false here on success because the page will redirect.
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/users/register', registerData);
            navigate(`/verify-otp/${res.data.userId}`);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
             <div className="text-center mb-8"><h1 className="text-4xl font-bold text-primary-teal">SpaceSnap</h1><p className="text-gray-500 mt-2">{isLoginView ? 'Welcome back! Please sign in.' : 'Create an account to get started.'}</p></div>
            <AnimatePresence mode="wait">
                {isLoginView ? (
                    <motion.form key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} onSubmit={handleLoginSubmit}>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                        <Input name="email" type="email" placeholder="Email Address" value={loginData.email} onChange={handleLoginChange} icon={<FaEnvelope />} />
                        <Input name="password" type="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} icon={<FaLock />} />
                        <div className="text-right mt-2 mb-4"><Link to="/forgot-password" className="text-sm text-primary-teal hover:underline">Forgot Password?</Link></div>
                        <button type="submit" disabled={loading} className="w-full bg-primary-teal text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400">{loading ? 'Signing In...' : 'Sign In'}</button>
                    </motion.form>
                ) : (
                    <motion.form key="register" variants={formVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} onSubmit={handleRegisterSubmit}>
                        {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                        <Input name="name" type="text" placeholder="Full Name" value={registerData.name} onChange={handleRegisterChange} icon={<FaUser />} />
                        <Input name="email" type="email" placeholder="Email Address" value={registerData.email} onChange={handleRegisterChange} icon={<FaEnvelope />} />
                        <Input name="password" type="password" placeholder="Password (min. 6 characters)" value={registerData.password} onChange={handleRegisterChange} icon={<FaLock />} />
                        <Input name="phoneNumber" type="tel" placeholder="Phone Number" value={registerData.phoneNumber} onChange={handleRegisterChange} icon={<FaPhone />} />
                        <button type="submit" disabled={loading} className="w-full bg-accent-gold text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400">{loading ? 'Creating Account...' : 'Create Account'}</button>
                    </motion.form>
                )}
            </AnimatePresence>
            <div className="mt-6 text-center text-sm">{isLoginView ? (<p>Don't have an account? <button onClick={() => { setIsLoginView(false); setError(''); }} className="font-semibold text-primary-teal hover:underline">Sign up</button></p>) : (<p>Already have an account? <button onClick={() => { setIsLoginView(true); setError(''); }} className="font-semibold text-primary-teal hover:underline">Sign in</button></p>)}</div>
            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">OR</span></div></div>
            <button className="w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"><FaGoogle className="mr-3 text-red-500" /> Continue with Google</button>
        </div>
    );
};
export default AuthForm;