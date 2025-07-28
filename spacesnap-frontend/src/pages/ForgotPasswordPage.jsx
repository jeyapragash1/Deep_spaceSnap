// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/layout/AuthLayout";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", {
        email,
      });
      setMessage(
        "An email has been sent with password reset instructions. Please check your Email."
      );
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-dark">
            Forgot Password
          </h2>
          <p className="text-gray-500 mt-2">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>
        <form onSubmit={onSubmit}>
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error}
            </p>
          )}
          {message && (
            <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
              {message}
            </p>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full py-3 px-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-primary-teal text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
export default ForgotPasswordPage;
