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
    <div className="flex flex-col min-h-screen bg-[#F8F9FF] dark:bg-[#0D0C1D] text-gray-900 dark:text-gray-100 transition-colors duration-700 selection:bg-[#0F82FF30]">
      {/* 🔮 Background Atmospheric Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#0F82FF08] dark:bg-[#0F82FF15] rounded-full blur-[120px] animate-pulse transition-all duration-[5000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B44CFF08] dark:bg-[#B44CFF15] rounded-full blur-[120px] animate-pulse transition-all duration-[6000ms] delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,130,255,0.02)_100%)]"></div>
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
            <div className="w-12 h-12 border-4 border-[#0F82FF30] border-t-[#0F82FF] rounded-full animate-spin"></div>
            <p className="text-xs font-black text-[#0F82FF] uppercase tracking-[0.3em] animate-pulse">Syncing Space</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            <Outlet />
          </div>
        )}
      </main>

      {!isChatPage && <Footer />}
    </div>
  );
};

export default Body;






