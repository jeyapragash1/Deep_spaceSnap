// src/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
// ... other imports

// Receive setIsLoggedIn from AuthPage
const LoginForm = ({ onSwitchToRegister, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // This updates the parent App component's state
      setIsLoggedIn(true);
      
      // We still use a hard redirect to ensure all components remount correctly
      window.location.href = '/dashboard';

    } catch (err) {
      setError(err.response?.data?.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component's return statement remains the same ...
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-neutral-dark">Welcome Back!</h2>
      {error && <AlertMessage message={error} type="error" />}
      <InputField label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" icon={<FaUser />} required />
      <InputField label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" icon={<FaLock />} required />
      <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? <LoadingSpinner size="sm" /> : 'Log In'}</Button>
      <p className="mt-6 text-center text-sm">Don't have an account?{' '}<button type="button" onClick={onSwitchToRegister} className="font-semibold text-primary-teal hover:underline">Sign Up</button></p>
    </form>
  );
};

export default LoginForm;