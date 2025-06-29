// src/features/auth/RegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios'; // We need axios for API calls
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import AlertMessage from '../../components/ui/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Frontend Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Make the API call to the backend registration endpoint
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      // Handle successful registration
      setSuccess(response.data.message + " Please log in.");
      
      // After 2 seconds, switch to the login form
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);

    } catch (err) {
      // Handle errors from the backend
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-neutral-dark">Create Your Account</h2>
      
      {error && <AlertMessage message={error} type="error" />}
      {success && <AlertMessage message={success} type="success" />}

      <InputField label="Full Name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" icon={<FaUser />} required />
      <InputField label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" icon={<FaEnvelope />} required />
      <InputField label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" icon={<FaLock />} required />
      <InputField label="Confirm Password" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" icon={<FaLock />} required />
      
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
      </Button>
      <p className="mt-6 text-center text-sm">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="font-semibold text-primary-teal hover:underline">
          Log In
        </button>
      </p>
    </form>
  );
};

export default RegisterForm;