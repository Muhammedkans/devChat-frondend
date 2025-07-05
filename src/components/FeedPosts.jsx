import { Loader2, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import usePostFeed from "../hooks/usePostFeed";
import PostCard from "./PostCard";
import { useSocket } from "../context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";

const FeedPosts = () => {
  const navigate = useNavigate();
  const { data: posts = [], isLoading, isError, error } = usePostFeed();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  // 🔐 Redirect if unauthorized
  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

  // 🔁 Realtime Like Update
  useEffect(() => {
    if (!socket) return;

    const handleLikeUpdate = (updatedPost) => {
      queryClient.setQueryData(["posts"], (oldPosts = []) =>
        oldPosts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        )
      );
    };

    socket.on("likeUpdated", handleLikeUpdate);
    return () => socket.off("likeUpdated", handleLikeUpdate);
  }, [socket, queryClient]);

  // 🌀 Loading UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-tr from-[#1a1a1a] to-[#111] rounded-xl shadow-inner text-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-blue-500 font-semibold">Loading your feed...</span>
      </div>
    );
  }

  // ❌ Error UI
  if (isError) {
    return (
      <div className="text-center mt-8 text-red-400 text-sm">
        ❌ Oops! Failed to load posts. Please try again later.
      </div>
    );
  }

  // 📭 No posts yet
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center mt-16 text-center bg-[#1E1F24] border border-[#2F2F3A] text-white p-6 rounded-2xl shadow-[0_0_20px_#0F82FF22] backdrop-blur-sm">
        <p className="mb-2 text-xl font-semibold text-white">Your feed is empty</p>
        <p className="text-sm text-gray-400 mb-6">Follow developers to see their posts here!</p>
        <Link
          to="/explore-developers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] text-white rounded-full hover:brightness-110 transition"
        >
          <UserPlus className="h-4 w-4" />
          Find Developers
        </Link>
      </div>
    );
  }

  // ✅ Render posts
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-[#1E1F24] border border-[#2F2F3A] rounded-2xl p-4 sm:p-6 shadow-[0_0_10px_#0F82FF11] hover:shadow-[0_0_20px_#0F82FF33] transition-all duration-300 backdrop-blur-sm"
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default FeedPosts;











