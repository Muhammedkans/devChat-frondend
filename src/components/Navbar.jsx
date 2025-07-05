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

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocket();
  const { data: user } = useMyProfile();

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
    <header className="sticky top-0 z-50 bg-[#0D0C1D] backdrop-blur-md shadow-[0_0_20px_#0F82FF33] border-b border-[#1A1B1F]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] via-[#B44CFF] to-[#0F82FF] hover:brightness-125 transition duration-300"
        >
          devChat
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block font-medium text-[#AAB2C8]">
              Welcome, <span className="text-white">{user.firstName}</span>
            </span>

            <div className="dropdown dropdown-end relative">
              <div
                tabIndex={0}
                role="button"
                className="avatar w-11 h-11 ring-2 ring-[#0F82FF] rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105 shadow-md"
              >
                <img
                  src={user.photoUrl}
                  alt="User avatar"
                  className="object-cover w-full h-full"
                />
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 shadow-xl bg-[#1A1B1F] bg-opacity-90 backdrop-blur-md rounded-xl w-60 text-[#E8E8E8] mt-3 z-[1] ring-1 ring-[#0F82FF22] space-y-1"
              >
                <li>
                  <Link to="/profile" className="flex justify-between items-center px-3 py-2 rounded-md hover:bg-[#0F82FF22] transition">
                    Profile
                    <span className="bg-[#0F82FF] text-white text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/connection" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#0F82FF22] transition">
                    <UserGroupIcon className="w-5 h-5 text-[#0F82FF]" />
                    My Friends
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#0F82FF22] transition">
                    <UserPlusIcon className="w-5 h-5 text-[#0F82FF]" />
                    Friend Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#0F82FF22] transition">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    Premium
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-800/20 text-red-500 transition w-full"
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











