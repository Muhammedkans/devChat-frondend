import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useMyProfile from '../hooks/useMyProfile';

import Navbar from './Navbar';
import Footer from './Footer';

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useMyProfile();

  useEffect(() => {
    if (isError && error?.response?.status === 401) {
      navigate('/login');
    }
  }, [isError, error, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {isLoading ? (
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






