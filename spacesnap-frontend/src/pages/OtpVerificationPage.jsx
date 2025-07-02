// src/pages/OtpVerificationPage.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';

const OtpVerificationPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { updateUserToken } = useAuth(); // We need a way to set the new token after verification
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/users/verify-otp', { userId, otp });
            // The backend sends a token upon successful verification
            updateUserToken(res.data.token);
            navigate('/dashboard'); // Redirect to dashboard gateway
        } catch (err) {
            setError(err.response?.data?.msg || 'Verification failed.');
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-dark">Verify Your Account</h2>
                    <p className="text-gray-500 mt-2">An OTP has been printed to your backend server console.</p>
                </div>
                <form onSubmit={onSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        maxLength="6"
                        className="w-full text-center text-2xl tracking-[1rem] py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
                        required
                    />
                    <button type="submit" disabled={loading} className="mt-6 w-full bg-primary-teal text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400">
                        {loading ? 'Verifying...' : 'Verify & Log In'}
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default OtpVerificationPage;