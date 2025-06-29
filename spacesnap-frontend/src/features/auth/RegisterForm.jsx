// src/features/auth/RegisterForm.jsx
import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      alert('Registration successful! Please log in. (Frontend simulation)');
      setLoading(false);
      onSwitchToLogin();
    }, 1500);
  };
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold text-center mb-6 text-neutral-dark">Create Your Account</h2>
      {error && <AlertMessage message={error} type="error" />}
      <InputField label="Full Name" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" icon={<FaUser />} required />
      <InputField label="Email" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@example.com" icon={<FaEnvelope />} required />
      <InputField label="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" icon={<FaLock />} required />
      <InputField label="Confirm Password" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" icon={<FaLock />} required />
      <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? <LoadingSpinner size="sm" /> : 'Create Account'}</Button>
      <p className="mt-6 text-center text-sm">Already have an account?{' '}<button type="button" onClick={onSwitchToLogin} className="font-semibold text-primary-teal hover:underline">Log In</button></p>
    </form>
  );
};
export default RegisterForm;