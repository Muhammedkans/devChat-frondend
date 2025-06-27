import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { API_URL } from "../utils/constant";
import { useSocket } from "../context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import useMyProfile from "../hooks/useMyProfile";

// ✅ Icons
import {
  UserGroupIcon,
  UserPlusIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocket();

  const { data: user } = useMyProfile();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      disconnectSocket();
      queryClient.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white">
        {/* 👨‍💻 Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide text-white hover:text-blue-300 transition">
          dev<span className="text-blue-400">Chat</span>
        </Link>

        {/* 👤 User Profile */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block font-medium">
              Welcome, {user.firstName}
            </span>

            {/* 🧑 Dropdown */}
            <div className="relative dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar w-10 h-10 ring-2 ring-blue-500 rounded-full overflow-hidden cursor-pointer"
              >
                <img
                  src={user.photoUrl}
                  alt="User avatar"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Dropdown menu */}
              <ul
                tabIndex={0}
                className="absolute right-0 mt-3 menu menu-sm dropdown-content z-50 p-2 shadow-lg bg-white rounded-xl w-56 text-gray-800"
              >
                <li>
                  <Link
                    to="/profile"
                    className="hover:bg-gray-100 rounded px-3 py-2 flex items-center justify-between"
                  >
                    Profile <span className="badge bg-blue-100 text-blue-700">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connection" className="hover:bg-gray-100 rounded px-3 py-2 flex items-center">
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    My Friends
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="hover:bg-gray-100 rounded px-3 py-2 flex items-center">
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Friend Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="hover:bg-gray-100 rounded px-3 py-2 flex items-center">
                    <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                    Premium
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:bg-red-100 rounded px-3 py-2 flex items-center text-red-600 w-full"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
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



