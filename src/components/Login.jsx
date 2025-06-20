import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constant';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [emailId, setEmailId] = useState("mondric@gmail.com");
  const [password, setPassword] = useState("Mondric@123");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // ✅ Validations
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
      dispatch(addUser(res.data.user)); // 👈 only user info
      navigate("/"); // or navigate("/profile");
    } catch (err) {
      console.error("Login Error:", err);
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

      dispatch(addUser(res.data.user)); // 👈 only user info
      navigate("/profile");
    } catch (err) {
      console.error("Signup Error:", err);
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="card w-96 shadow-xl bg-black text-white sm:w-80">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-4">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          {/* Sign Up Fields */}
          {!isLoginForm && (
            <>
              <label className="form-control">
                <span className="label-text text-white">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input input-bordered text-black"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-white">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input input-bordered text-black"
                />
              </label>
            </>
          )}

          {/* Email */}
          <label className="form-control">
            <span className="label-text text-white">Email ID</span>
            <input
              type="text"
              ref={emailRef}
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input input-bordered text-black"
            />
          </label>

          {/* Password */}
          <label className="form-control relative">
            <span className="label-text text-white">Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input input-bordered text-black pr-10"
            />
            <button
              type="button"
              className="absolute top-[34px] right-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          {/* Error */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Submit */}
          <button
            onClick={isLoginForm ? handleLogin : handleSignUp}
            disabled={loading}
            className="btn btn-primary w-full mt-4"
          >
            {loading ? "Please wait..." : isLoginForm ? "Login" : "Sign Up"}
          </button>

          {/* Switch form */}
          <p className="text-center mt-2 cursor-pointer" onClick={() => setIsLoginForm(!isLoginForm)}>
            {isLoginForm ? "New user? Sign up here" : "Already registered? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
