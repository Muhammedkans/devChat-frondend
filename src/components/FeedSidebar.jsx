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

  if (isLoading)
    return (
      <div className="p-4 text-center text-sm text-gray-600">Loading...</div>
    );

  if (isError)
    return (
      <div className="p-4 text-center text-sm text-red-500">
        Failed to load profile.
      </div>
    );

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
    <div className="bg-gradient-to-br from-gray-50 to-blue-100 rounded-xl shadow p-6 text-center space-y-4 transition">
      <img
        src={user?.photoUrl}
        alt="Profile"
        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-blue-300 shadow-md"
      />
      <div>
        <p className="text-xl font-semibold text-gray-800">
          {user?.firstName} {user?.lastName}
        </p>
        {user?.isPremium && (
          <span className="text-sm text-blue-600 font-semibold bg-blue-100 px-2 py-0.5 rounded-full inline-block mt-1">
            Premium ✓
          </span>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1 rounded-full font-medium transition"
      >
        Logout
      </button>
    </div>
  );
};

export default FeedSidebar;




