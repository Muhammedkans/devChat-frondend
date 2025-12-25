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
      <div className="flex justify-center items-center h-64 bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] rounded-[2rem] shadow-xl backdrop-blur-3xl">
        <Loader2 className="h-8 w-8 animate-spin text-[#0F82FF]" />
        <span className="ml-3 text-[#0F82FF] font-black uppercase tracking-widest text-xs">Syncing Feed...</span>
      </div>
    );
  }

  // ❌ Error UI
  if (isError) {
    return (
      <div className="text-center mt-8 text-red-500 text-sm font-bold bg-red-100 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200 dark:border-red-500/20">
        ❌ Connection signal lost. Unable to retrieve feed.
      </div>
    );
  }

  // 📭 No posts yet
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center mt-16 text-center bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] p-8 rounded-[2rem] shadow-xl backdrop-blur-3xl">
        <p className="mb-2 text-xl font-black text-gray-900 dark:text-white">Your feed is waiting for a spark</p>
        <p className="text-sm text-gray-500 mb-6 font-medium">Connect with developers to ignite your timeline!</p>
        <Link
          to="/connection"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F82FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Build Network
        </Link>
      </div>
    );
  }

  // ✅ Render posts
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] rounded-[2rem] p-0 shadow-xl hover:shadow-2xl hover:scale-[1.005] transition-all duration-500 backdrop-blur-3xl overflow-hidden group"
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default FeedPosts;











