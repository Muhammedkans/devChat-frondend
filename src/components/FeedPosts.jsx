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

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login");
    }
  }, [error, navigate]);

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

  // 🌀 Spinner while loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-blue-600 font-medium">Loading your feed...</span>
      </div>
    );
  }

  // ❌ Error message
  if (isError) {
    return (
      <div className="text-center mt-8 text-red-500 text-sm">
        Oops! Failed to load posts. Please try again later.
      </div>
    );
  }

  // 📭 No posts
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center mt-16 text-center text-gray-500">
        <p className="mb-4 text-lg font-semibold">Your feed is empty.</p>
        <p className="text-sm mb-6">Follow other developers to see their posts here.</p>
        <Link
          to="/explore-developers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          <UserPlus className="h-4 w-4" />
          Find Developers
        </Link>
      </div>
    );
  }

  // ✅ Post list
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-xl shadow-md border border-blue-100 hover:shadow-lg transition p-6"
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default FeedPosts;









