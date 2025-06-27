import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useMyProfile from "../hooks/useMyProfile";
import { API_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import { useSocket } from "../context/SocketContext";

const FeedSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError, error } = useMyProfile();
  const { disconnectSocket } = useSocket();

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-gray-600">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Failed to load profile.
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      disconnectSocket();
      queryClient.clear();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-md p-6 text-center space-y-4 transition-all duration-300">
      {/* 🧑‍💻 Avatar */}
      <img
        src={
          user?.photoUrl ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`
        }
        alt="Profile"
        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-200 shadow-sm"
      />

      {/* 👤 Name + Premium */}
      <div>
        <p className="text-xl font-semibold text-gray-800">
          {user?.firstName} {user?.lastName}
        </p>
        {user?.isPremium && (
          <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-0.5 rounded-full inline-block mt-1">
            ⭐ Premium Member
          </span>
        )}
      </div>

      {/* 🔘 Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-full transition"
      >
        Logout
      </button>
    </div>
  );
};

export default FeedSidebar;





