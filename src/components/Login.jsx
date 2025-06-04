import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constant.js';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [emailId, setEmailId] = useState("mondric@gmail.com");
  const [password, setPassword] = useState("Mondric@123");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsloginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const validateFirstName = (firstName) => {
    return firstName.trim().length > 0;
  };

  const validateLastName = (lastName) => {
    return lastName.trim().length > 0;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    if (!validateEmail(emailId)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(API_URL + "/login", { emailId, password }, { withCredentials: true });
      dispatch(addUser(res?.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Validate all fields
    if (!validateFirstName(firstName)) {
      setError("Please enter a valid first name.");
      return;
    }
    if (!validateLastName(lastName)) {
      setError("Please enter a valid last name.");
      return;
    }
    if (!validateEmail(emailId)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    // Proceed with API call
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(API_URL + "/signup", { firstName, lastName, emailId, password }, { withCredentials: true });
      dispatch(addUser(res?.data?.data));
      setFirstName("");
      setLastName("");
      setEmailId("");
      setPassword("");
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data?.message || "An error occurred. Please try again.");
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
      <div className="card w-96 shadow-xl bg-black sm:w-80">
        <div className="card-body text-white">
          <h2 className="card-title justify-center">{isLoginForm ? "Login" : "Sign Up"}</h2>

          {!isLoginForm && (
            <div>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-white">First Name:</span>
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input input-bordered w-full max-w-xs text-black"
                  aria-label="First Name"
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-white">Last Name:</span>
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input input-bordered w-full max-w-xs text-black"
                  aria-label="Last Name"
                />
              </label>
            </div>
          )}

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-white">Email ID</span>
            </div>
            <input
              type="text"
              value={emailId}
              onChange={(e) => {
                setEmailId(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className="input input-bordered w-full max-w-xs text-black"
              aria-label="Email ID"
              ref={emailRef}
            />
          </label>

          <label className="form-control w-full max-w-xs relative">
            <div className="label">
              <span className="label-text text-white">Password</span>
            </div>
            <input
              className="input input-bordered w-full max-w-xs text-black pr-10"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Password"
            />
            <button
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </label>

          <p className="text-red-700">{error}</p>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading ? "Loading..." : isLoginForm ? "LogIn" : "Sign Up"}
            </button>
          </div>
          <p className="cursor-pointer m-auto" onClick={() => setIsloginForm((value) => !value)}>
            {isLoginForm ? "New User ? Sign Up" : "Existing User ? Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;