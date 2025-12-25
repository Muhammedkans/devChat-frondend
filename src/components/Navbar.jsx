import axios from "axios";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../utils/constant";
import { useSocket } from "../context/SocketContext";
import useMyProfile from "../hooks/useMyProfile";
import {
  Bell,
  MessageCircle,
  Users,
  UserPlus,
  Settings,
  LogOut,
  Search,
  Moon,
  Sun,
  Crown,
  LayoutGrid
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocket();
  const { data: user } = useMyProfile();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      queryClient.clear();
      disconnectSocket();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Feed", path: "/", icon: LayoutGrid },
    { name: "Network", path: "/connection", icon: Users },
    { name: "Requests", path: "/requests", icon: UserPlus },
    { name: "Chat", path: "/chat", icon: MessageCircle, hiddenOnMobile: true },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full px-4 sm:px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 dark:bg-[#10131A]/80 backdrop-blur-2xl border border-white/20 dark:border-[#2F2F3A] px-6 py-3 rounded-[2rem] shadow-2xl transition-all duration-500">

        {/* 🚀 Brand & Search */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] via-[#B44CFF] to-[#0F82FF] hover:brightness-110 active:scale-95 transition-all"
          >
            devChat
          </Link>

          <div className="hidden md:flex items-center gap-3 bg-gray-100 dark:bg-[#1A1B1F] border border-gray-200 dark:border-[#2F2F3A] px-4 py-2 rounded-2xl focus-within:ring-2 ring-[#0F82FF50] transition-all">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search developers..."
              className="bg-transparent border-none outline-none text-xs font-bold text-gray-700 dark:text-gray-300 w-48 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* 🧭 Nav Menu */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-50/50 dark:bg-[#1A1B1F]/50 p-1 rounded-2xl border border-gray-100 dark:border-[#2F2F3A]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === link.path
                  ? "bg-[#0F82FF] text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-500 hover:text-[#0F82FF] hover:bg-[#0F82FF10]"
                }`}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </div>

        {/* 👤 User Actions */}
        {user ? (
          <div className="flex items-center gap-3 sm:gap-6">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-gray-100 dark:bg-[#1A1B1F] border border-gray-200 dark:border-[#2F2F3A] hover:bg-[#0F82FF15] text-[#0F82FF] transition-all duration-300 transform active:scale-90"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button className="relative p-3 rounded-2xl bg-gray-100 dark:bg-[#1A1B1F] border border-gray-200 dark:border-[#2F2F3A] hover:bg-[#0F82FF15] text-[#0F82FF] transition-all group">
              <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#10131A]"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end relative">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 bg-gray-100 dark:bg-[#1A1B1F] border border-gray-200 dark:border-[#2F2F3A] p-1 pr-4 rounded-full hover:bg-gray-200 dark:hover:bg-[#2F2F3A] transition-all active:scale-95"
              >
                <div className="relative">
                  <img
                    src={user.photoUrl}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0F82FF] shadow-lg"
                  />
                  {user.isPremium && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full shadow-lg border border-white">
                      <Crown className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-[10px] font-black text-gray-900 dark:text-white truncate max-w-[80px]">
                    {user.firstName}
                  </p>
                  <p className="text-[8px] font-bold text-[#0F82FF] uppercase tracking-widest">
                    {user.isPremium ? "Premium" : "Free"}
                  </p>
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 shadow-2xl bg-white/95 dark:bg-[#13141F]/95 backdrop-blur-2xl rounded-[2rem] w-64 mt-4 z-[100] border border-gray-100 dark:border-[#2F2F3A] space-y-2 animate-in fade-in zoom-in slide-in-from-top-2 duration-300"
              >
                <li>
                  <Link to="/profile" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#0F82FF10] text-gray-700 dark:text-gray-200 font-bold transition">
                    <div className="p-2 bg-[#0F82FF10] rounded-xl text-[#0F82FF]">
                      <Settings className="w-4 h-4" />
                    </div>
                    Account Profile
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-yellow-500/10 text-gray-700 dark:text-gray-200 font-bold transition">
                    <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
                      <Crown className="w-4 h-4" />
                    </div>
                    Upgrade to Premium
                  </Link>
                </li>
                <div className="h-px bg-gray-100 dark:bg-[#2F2F3A] my-2 mx-4"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 text-red-500 font-bold transition w-full"
                  >
                    <div className="p-2 bg-red-100 rounded-xl">
                      <LogOut className="w-4 h-4" />
                    </div>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-8 py-3 bg-[#0F82FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(15,130,255,0.4)] transition-all active:scale-95"
          >
            Join Society
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;











