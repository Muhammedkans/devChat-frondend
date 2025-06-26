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

  // ✅ Using live user profile from React Query
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
    <div className="sticky top-0 z-50">
      <div className="navbar bg-black text-white shadow-md px-4">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl text-white">
            devChat
          </Link>
        </div>

        {/* Right: User Section */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block">Welcome, {user.firstName}</span>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 h-10 rounded-full ring-2 ring-blue-500">
                  <img src={user.photoUrl} alt="profile" />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-56 text-black"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connection">
                    <UserGroupIcon className="w-5 h-5 mr-2" />
                    My Friends
                  </Link>
                </li>
                <li>
                  <Link to="/requests">
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Friend Requests
                  </Link>
                </li>
                <li>
                  <Link to="/premium">
                    <StarIcon className="w-5 h-5 mr-2 text-yellow-500" />
                    Premium
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout}>
                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2 text-red-500" />
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;


