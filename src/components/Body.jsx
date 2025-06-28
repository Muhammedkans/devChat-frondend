import React, { useEffect, useState } from 'react';
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

  const [loadingUser, setLoadingUser] = useState(true);
  const isChatPage = location.pathname.startsWith("/chat");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/profile/view`, {
          withCredentials: true,
        });

        dispatch(addUser(res?.data));
      } catch (err) {
        if (err?.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("User fetch failed:", err.message);
        }
      } finally {
        setLoadingUser(false);
      }
    };

    // Always try to fetch if userData not available
    if (!userData || !userData._id) {
      fetchUser();
    } else {
      setLoadingUser(false);
    }
  }, [dispatch, navigate, userData]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {loadingUser ? (
          <div className="flex justify-center items-center h-screen text-blue-600 font-medium">
            Loading user profile...
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {!isChatPage && <Footer />}
    </div>
  );
};

export default Body;



