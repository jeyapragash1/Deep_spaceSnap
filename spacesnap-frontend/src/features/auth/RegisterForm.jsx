// src/features/auth/RegisterForm.jsx
import React, { useState } from 'react';
import axios from 'axios'; // Import axios to make API calls
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
  
  // State for handling messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // --- Frontend Validation ---
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // --- Make the API call to the backend ---
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      // Handle a successful response from the server
      setSuccess(response.data.message + ' Please log in.'); // Show success message
      
      // Clear the form after a short delay and then switch to login
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000); // Wait 2 seconds

    } catch (err) {
      // Handle an error response from the server
      // The backend sends a 'message' property in its error response
      setError(err.response?.data?.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-neutral-dark">Create Your Account</h2>
      
      {/* Display error or success messages */}
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