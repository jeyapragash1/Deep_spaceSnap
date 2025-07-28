// src/features/auth/AuthForm.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

const formVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};
const Input = ({
  name,
  type,
  placeholder,
  icon,
  value,
  onChange,
  required = true,
}) => (
  <div className="relative mb-4">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      {icon}
    </span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-teal"
    />
  </div>
);

const AuthForm = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isStepTwo, setIsStepTwo] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const location = useLocation();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "registered",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLoginChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) =>
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  // --- THIS IS THE CORRECTED LOGIN SUBMIT FUNCTION ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(loginData.email, loginData.password);
      // On success, AuthContext will handle the redirect.
      // We don't need to do anything here.
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      // This 'finally' block GUARANTEES that loading is set back to false,
      // whether the login succeeds or fails. This stops the infinite spinner.
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        registerData
      );
      // clear form and switch to login view
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "registered",
      });
      setLoginData({ email: "", password: "" });
      setIsStepTwo(false);
      alert(res.data.msg); // Show "Registration successful! Please log in."
      setIsLoginView(true); // Switch to login view
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-teal">SpaceSnap</h1>
        <p className="text-gray-500 mt-2">
          {isLoginView
            ? "Welcome back! Please sign in."
            : "Create an account to get started."}
        </p>
      </div>
      <AnimatePresence mode="wait">
        {isLoginView ? (
          <motion.form
            key="login"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={handleLoginSubmit}
          >
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </p>
            )}
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={handleLoginChange}
              icon={<FaEnvelope />}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              icon={<FaLock />}
            />

            <div className="text-right mt-2 mb-4">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-teal hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-teal text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={handleRegisterSubmit}
          >
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </p>
            )}

            {isStepTwo && (
              <>
                <Input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  icon={<FaUser />}
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  icon={<FaEnvelope />}
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  icon={<FaLock />}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  icon={<FaLock />}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-teal text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </>
            )}

            {/* Role Selection */}
            {!isStepTwo && (
              <div className="mb-4 text-sm">
                <p className="mb-2">Select your role:</p>
                <div className="flex gap-4 mb-4 w-full">
                  <label htmlFor="role-registered" className="flex-1">
                    <input
                      type="radio"
                      id="role-registered"
                      name="role"
                      value="registered"
                      className="peer sr-only"
                      checked={registerData.role === "registered"}
                      onChange={handleRegisterChange}
                    />
                    <div className="border-gray-400 border peer-checked:border-transparent peer-checked:bg-primary-teal cursor-pointer rounded-md w-full px-3 text-center py-2 peer-checked:text-white">
                      User
                    </div>
                  </label>
                  <label htmlFor="role-designer" className="flex-1">
                    <input
                      type="radio"
                      id="role-designer"
                      name="role"
                      value="designer"
                      className="peer sr-only"
                      checked={registerData.role === "designer"}
                      onChange={handleRegisterChange}
                    />
                    <div className="border-gray-400 border peer-checked:border-transparent peer-checked:bg-primary-teal cursor-pointer rounded-md w-full px-3 text-center py-2 peer-checked:text-white">
                      Designer
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsStepTwo(true);
                    setError("");
                  }}
                  className={
                    "mt-2 w-full py-2 rounded-md text-white bg-teal-700"
                  }
                >
                  Continue as{" "}
                  {registerData.role === "designer" ? "Designer" : "User"}
                </button>
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
      <div className="mt-6 text-center text-sm">
        {isLoginView ? (
          <p>
            Don't have an account?{" "}
            <button
              onClick={() => {
                setIsLoginView(false);
                setError("");
              }}
              className="font-semibold text-primary-teal hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              onClick={() => {
                setIsLoginView(true);
                setError("");
              }}
              className="font-semibold text-primary-teal hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>

      {(isLoginView || isStepTwo) && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setError("");
              await loginWithGoogle(
                credentialResponse.credential,
                registerData.role
              ).catch((err) => {
                const error = JSON.parse(err.message);
                setError(error?.msg || "Login Failed. Please try again.");
                if (isLoginView) {
                  setLoginData({ email: error?.email || "", password: "" });
                }
              });
            }}
            onError={() => {
              setError("Login Failed. Please try again.");
            }}
          />
        </>
      )}
    </div>
  );
};
export default AuthForm;
