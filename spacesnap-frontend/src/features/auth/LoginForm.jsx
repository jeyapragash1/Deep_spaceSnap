// src/features/auth/LoginForm.jsx
import React, { useState } from 'react';
import InputField from '../../components/common/InputField';
import Button from '../../components/common/Button';
import AlertMessage from '../../components/ui/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaUser, FaLock } from 'react-icons/fa';

const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true); setError('');
    setTimeout(() => {
      if (email === 'test@user.com' && password === 'password123') {
        alert('Login Successful! (Frontend simulation)');
        window.location.href = '/dashboard';
      } else { setError('Invalid email or password.'); }
      setLoading(false);
    }, 1500);
  };
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