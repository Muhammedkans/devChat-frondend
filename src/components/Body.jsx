// src/components/Body.jsx

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import Navbar from './Navbar';
import Footer from './Footer';
import { API_URL } from '../utils/constant.js';
import { addUser } from '../utils/userSlice.js';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      if (userData) return;

      const res = await axios.get(API_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res?.data));
    } catch (err) {
      if (err?.response?.status === 401) {
        return navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isChatPage && <Footer />}
    </div>
  );
};

export default Body;
