import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../utils/constant';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ useQueryClient hook

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateFirstName = (text) => text.trim().length > 0;
  const validateLastName = (text) => text.trim().length > 0;

  const handleLogin = async () => {
    setError("");
    if (!validateEmail(emailId)) return setError("Please enter a valid email.");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { emailId, password }, { withCredentials: true });

      // ✅ Set data in React Query cache to skip fetch in Body.jsx
      queryClient.setQueryData(['my-profile'], res.data.user);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setError("");
    if (!validateFirstName(firstName)) return setError("Enter valid first name.");
    if (!validateLastName(lastName)) return setError("Enter valid last name.");
    if (!validateEmail(emailId)) return setError("Please enter a valid email.");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters.");

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        emailId,
        password,
      }, { withCredentials: true });

      // ✅ Set user in cache after signup too (optional)
      queryClient.setQueryData(['my-profile'], res.data.user);

      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      isLoginForm ? handleLogin() : handleSignUp();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#111827] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl p-6 sm:p-8 backdrop-blur-md bg-white/5 border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-purple-300 mb-6">
          {isLoginForm ? "Welcome Back" : "Create Account"}
        </h2>

        {!isLoginForm && (
          <>
            <div className="mb-4">
              <label className="block text-sm text-purple-200 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-purple-200 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm text-purple-200 mb-1">Email ID</label>
          <input
            type="text"
            ref={emailRef}
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm text-purple-200 mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            className="absolute top-8 right-3 text-gray-400 hover:text-purple-400"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={isLoginForm ? handleLogin : handleSignUp}
          disabled={loading}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition disabled:opacity-50"
        >
          {loading ? "Please wait..." : isLoginForm ? "Login" : "Sign Up"}
        </button>

        <p
          className="text-center text-sm text-purple-200 mt-4 hover:underline cursor-pointer"
          onClick={() => setIsLoginForm(!isLoginForm)}
        >
          {isLoginForm ? "New user? Sign up here" : "Already registered? Login here"}
        </p>
      </div>
    </div>
  );
};

export default Login;



