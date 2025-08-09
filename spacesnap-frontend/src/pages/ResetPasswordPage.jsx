// src/pages/ResetPasswordPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/layout/AuthLayout";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await axios.post(`http://localhost:5000/api/users/reset-password`, {
        token,
        password,
        confirmPassword,
      });
      setMessage(
        "Password reset successful! You can now log in with your new password."
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 300);
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // return to login if no token is provided
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <AuthLayout>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-dark">
            Reset Your Password
          </h2>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full py-3 px-4 bg-gray-100 rounded-lg mb-4"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full py-3 px-4 bg-gray-100 rounded-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-primary-teal text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};
export default ResetPasswordPage;
