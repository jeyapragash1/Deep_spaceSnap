// src/pages/EmailVerificationPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/layout/AuthLayout";
import LoadingSpinner from "../components/common/LoadingSpinner";

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/verify-email",
        { token }
      );
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Verification failed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !loading) {
      onSubmit();
    }
  }, [token]);

  return (
    <AuthLayout>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-medium text-center mb-6">
          Email Verification
        </h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {loading && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationPage;
