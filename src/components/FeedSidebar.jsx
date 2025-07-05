import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useMyProfile from "../hooks/useMyProfile";
import { API_URL } from "../utils/constant";
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

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });

     queryClient.removeQueries(['my-profile']);
      queryClient.invalidateQueries(['my-profile']);
      queryClient.clear(); // Optional: clear all if needed

      disconnectSocket();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-sm text-gray-400">Loading...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-sm text-red-500">Failed to load profile.</div>;
  }

  return (
    <div className="bg-[#10131a] border border-[#2F2F3A] p-6 rounded-2xl shadow-[0_0_15px_#0F82FF22] text-white text-center space-y-5">
      {/* 🧑‍💻 Avatar */}
      <img
        src={
          user?.photoUrl ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`
        }
        alt="Profile"
        className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#0F82FF] shadow"
      />

      {/* 👤 Name + Premium */}
      <div>
        <p className="text-xl font-semibold text-white">
          {user?.firstName} {user?.lastName}
        </p>
        {user?.isPremium && (
          <span className="mt-2 inline-block text-sm font-medium text-blue-400 bg-[#0f82ff1a] px-3 py-1 rounded-full">
            ⭐ Premium Member
          </span>
        )}
      </div>

      {/* 🔘 Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:brightness-110 text-white font-medium py-2 rounded-full transition"
      >
        Logout
      </button>
    </div>
  );
};

export default FeedSidebar;







