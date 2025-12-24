import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../utils/constant";
import { useSocket } from "../context/SocketContext";
import useMyProfile from "../hooks/useMyProfile";
import {
  UserGroupIcon,
  UserPlusIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocket();
  const { data: user } = useMyProfile();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

      queryClient.removeQueries(['my-profile']);
      queryClient.invalidateQueries(['my-profile']);
      queryClient.clear(); // Optional: clear all if needed

      disconnectSocket();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0D0C1D] dark:bg-[#0D0C1D] bg-opacity-80 backdrop-blur-md shadow-[0_0_20px_rgba(15,130,255,0.2)] border-b border-[#1A1B1F] dark:border-[#1A1B1F] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] via-[#B44CFF] to-[#0F82FF] hover:brightness-125 transition duration-300"
        >
          devChat
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block font-medium text-[#AAB2C8] dark:text-[#AAB2C8]">
              Welcome, <span className="text-[#0F82FF] dark:text-white">{user.firstName}</span>
            </span>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#1A1B1F] darK:bg-[#1A1B1F] border border-[#2F2F3A] hover:bg-[#0F82FF22] transition-all duration-300 transform hover:rotate-12 shadow-lg"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-[#0F82FF]" />
              )}
            </button>

            <div className="dropdown dropdown-end relative">
              <div
                tabIndex={0}
                role="button"
                className="avatar w-11 h-11 ring-2 ring-[#0F82FF] rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-110 shadow-[0_0_10px_rgba(15,130,255,0.4)]"
              >
                <img
                  src={user.photoUrl}
                  alt="User avatar"
                  className="object-cover w-full h-full"
                />
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 shadow-2xl bg-[#13141F] dark:bg-[#13141F] bg-opacity-95 backdrop-blur-xl rounded-2xl w-60 text-white mt-3 z-[1] border border-[#0F82FF22] space-y-2 animate-in fade-in zoom-in duration-200"
              >
                <li>
                  <Link to="/profile" className="flex justify-between items-center px-4 py-2.5 rounded-xl hover:bg-[#0F82FF] hover:text-white transition">
                    <span>Profile</span>
                    <span className="bg-[#0F82FF] text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      New
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/connection" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#0F82FF22] transition">
                    <UserGroupIcon className="w-5 h-5 text-[#0F82FF]" />
                    My Friends
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#0F82FF22] transition">
                    <UserPlusIcon className="w-5 h-5 text-[#0F82FF]" />
                    Friend Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#0F82FF22] transition">
                    <StarIcon className="w-5 h-5 text-yellow-400 animate-pulse" />
                    Premium
                  </Link>
                </li>
                <div className="divider my-1 before:bg-[#2F2F3A] after:bg-[#2F2F3A]"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-500 font-medium transition w-full"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;











