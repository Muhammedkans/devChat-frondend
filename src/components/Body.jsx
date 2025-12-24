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
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0D0C1D] text-gray-900 dark:text-white transition-colors duration-500">
      <Navbar />
      <main className="flex-1 relative overflow-hidden">
        {/* Subtle background glow for dark mode */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0F82FF08] dark:bg-[#0F82FF10] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#B44CFF08] dark:bg-[#B44CFF08] rounded-full blur-[120px] pointer-events-none"></div>

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






