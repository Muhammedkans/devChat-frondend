import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { API_URL } from '../utils/constant';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    emailRef.current?.focus();
  }, [isLoginForm]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const validateFirstName = (text) => text.trim().length > 0;
  const validateLastName = (text) => text.trim().length > 0;

  const handleLogin = async () => {
    if (!validateEmail(emailId)) return toast.error("Please enter a valid email.");
    if (!validatePassword(password)) return toast.error("Password must be at least 8 characters.");

    setLoading(true);
    const toastId = toast.loading("Accessing your dashboard...");
    try {
      const res = await axios.post(`${API_URL}/login`, { emailId, password }, { withCredentials: true });
      queryClient.setQueryData(['my-profile'], res.data.user);
      toast.success(`Welcome back, ${res.data.user.firstName}!`, { id: toastId });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateFirstName(firstName)) return toast.error("First name is required.");
    if (!validateLastName(lastName)) return toast.error("Last name is required.");
    if (!validateEmail(emailId)) return toast.error("Please enter a valid email.");
    if (!validatePassword(password)) return toast.error("Password must be at least 8 characters.");

    setLoading(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        emailId,
        password,
      }, { withCredentials: true });
      queryClient.setQueryData(['my-profile'], res.data.user);
      toast.success("Account created successfully!", { id: toastId });
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed", { id: toastId });
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      {/* 🎆 Dynamic Background Effects */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,#0F82FF15_0%,transparent_25%)] animate-spin-slow pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#B44CFF]/20 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#0F82FF]/10 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="w-full max-w-lg z-10">
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          {/* ✨ Logo/Brand */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2 flex items-center justify-center gap-2">
              devChat <span className="text-[#0F82FF] text-5xl">.</span>
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              {isLoginForm ? "Welcome back to the elite network." : "Join the future of developer connection."}
            </p>
          </div>

          {/* 📝 Form Fields */}
          <div className="space-y-5">
            {!isLoginForm && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F82FF] transition-colors" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#1A1B1F]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F82FF]/50 focus:bg-[#1A1B1F] transition-all"
                  />
                </div>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F82FF] transition-colors" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-[#1A1B1F]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F82FF]/50 focus:bg-[#1A1B1F] transition-all"
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F82FF] transition-colors" />
              <input
                type="text"
                ref={emailRef}
                placeholder="Email Address"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1A1B1F]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F82FF]/50 focus:bg-[#1A1B1F] transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0F82FF] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-[#1A1B1F]/50 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#0F82FF]/50 focus:bg-[#1A1B1F] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 🚀 Action Button */}
          <button
            onClick={isLoginForm ? handleLogin : handleSignUp}
            disabled={loading}
            className="w-full mt-8 py-4 bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isLoginForm ? "Login Account" : "Get Started"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* 🔄 Switch Mode */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {isLoginForm ? "No account yet? " : "Already included? "}
              <button
                onClick={() => setIsLoginForm(!isLoginForm)}
                className="text-[#0F82FF] font-bold hover:text-white transition-colors ml-1"
              >
                {isLoginForm ? "Create an account" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



