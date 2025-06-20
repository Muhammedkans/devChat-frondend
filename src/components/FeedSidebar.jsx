// src/components/FeedSidebar.jsx
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import useMyProfile from "../hooks/useMyProfile";
import { API_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";

const FeedSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError, error } = useMyProfile();

  // ✅ If not authorized, go to login
  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

  // 🌀 Loading
  if (isLoading) return <p>Loading...</p>;

  // ❌ Error (other than 401)
  if (isError) return <p className="text-red-500">Failed to load profile.</p>;

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser()); // 🧹 Clear Redux state
      queryClient.clear();    // 🧹 Clear React Query cache
      navigate("/login");     // 🔁 Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <img
        src={user?.photoUrl}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border"
      />
      <p className="text-lg font-semibold">
        {user?.firstName} {user?.lastName}
      </p>
      <button onClick={handleLogout} className="text-red-500 hover:underline">
        Logout
      </button>
    </div>
  );
};

export default FeedSidebar;


