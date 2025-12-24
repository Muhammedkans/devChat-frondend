import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import useMyProfile from "../hooks/useMyProfile";
import { useMutation } from "@tanstack/react-query";
import { likePost, unlikePost } from "../api/postLike";
import { useSocket } from "../context/SocketContext";
import { Link } from "react-router-dom";

import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { savePost, unsavePost } from "../api/postSave";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const { data: myUser, refetch: refetchProfile } = useMyProfile();
  const { socket } = useSocket();

  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const isSaved = myUser?.savedPosts?.includes(post._id);
  const hasLiked = myUser?._id && likes.includes(myUser._id);

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await unsavePost(post._id);
        toast.success("Removed from bookmarks");
      } else {
        await savePost(post._id);
        toast.success("Post bookmarked!");
      }
      refetchProfile(); // Refresh myUser to update isSaved state
    } catch (error) {
      toast.error("Failed to update bookmark");
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handleLikeUpdate = ({ postId, userId, action }) => {
      if (postId !== post._id) return;
      setLikes((prev) => {
        if (action === "like" && !prev.includes(userId)) {
          return [...prev, userId];
        } else if (action === "unlike") {
          return prev.filter((id) => id !== userId);
        }
        return prev;
      });
    };
    socket.on("likeUpdate", handleLikeUpdate);
    return () => socket.off("likeUpdate", handleLikeUpdate);
  }, [socket, post._id]);

  useEffect(() => {
    if (!socket) return;
    const handleCommentCountUpdate = ({ postId, commentCount: newCount }) => {
      if (postId === post._id && typeof newCount === "number") {
        setCommentCount(newCount);
      }
    };
    socket.on("commentCountUpdate", handleCommentCountUpdate);
    return () => socket.off("commentCountUpdate", handleCommentCountUpdate);
  }, [socket, post._id]);

  const likeMutation = useMutation({
    mutationFn: ({ hasLiked }) =>
      hasLiked ? unlikePost(post._id) : likePost(post._id),
  });

  const handleLike = () => {
    if (!myUser?._id) return;
    const alreadyLiked = likes.includes(myUser._id);
    setLikes((prev) =>
      alreadyLiked ? prev.filter((id) => id !== myUser._id) : [...prev, myUser._id]
    );
    socket?.emit("likeUpdate", {
      postId: post._id,
      userId: myUser._id,
      action: alreadyLiked ? "unlike" : "like",
    });
    likeMutation.mutate({ hasLiked: alreadyLiked });
  };

  const isMyPost = myUser?._id === post.user?._id;
  const profileLink = isMyPost ? "/profile" : `/users/${post.user?._id || ""}`;

  const profileImage =
    post.user?.photoUrl ||
    "https://api.dicebear.com/7.x/initials/svg?seed=" + post.user?.firstName;

  return (
    <div className="rounded-3xl border border-white/20 dark:border-[#2F2F3A] bg-white dark:bg-[#10131A] bg-opacity-70 dark:bg-opacity-80 backdrop-blur-2xl shadow-xl transition-all duration-300 mb-8 overflow-hidden group">

      {/* 👤 User Info */}
      <div className="flex items-center justify-between px-6 py-5">
        <Link
          to={profileLink}
          className="flex items-center gap-4 hover:bg-gray-100 dark:hover:bg-[#1A1B1F] p-2 rounded-2xl transition-all duration-300"
        >
          <div className="relative">
            <img
              src={profileImage}
              alt="User"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0F82FF] ring-offset-2 ring-offset-white dark:ring-offset-[#10131A]"
            />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">
              {post.user?.firstName} {post.user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{post.createdAt?.slice(0, 10)}</p>
          </div>
        </Link>

        {/* Bookmark Button */}
        <button
          onClick={handleSaveToggle}
          className={`p-2.5 rounded-2xl transition-all duration-300 hover:scale-110 ${isSaved ? "bg-[#0F82FF] text-white" : "bg-gray-100 dark:bg-[#1A1B1F] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#2F2F3A]"
            }`}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* 📝 Post Text */}
      {post.contentText && (
        <div className="px-6 pb-4">
          <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-medium">
            {post.contentText}
          </p>
        </div>
      )}

      {/* 🖼️ Post Image */}
      {post.contentImageUrl && (
        <div className="px-6 pb-4">
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2F2F3A] shadow-inner">
            <img
              src={post.contentImageUrl}
              alt="Post"
              className="w-full max-h-[600px] object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in"
            />
          </div>
        </div>
      )}

      {/* ❤️ + 💬 + 🔗 Actions */}
      <div className="flex items-center px-6 py-4 gap-6 border-t border-gray-100 dark:border-[#2F2F3A]/50 bg-gray-50/50 dark:bg-black/20">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 ${hasLiked ? "bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "hover:bg-gray-200 dark:hover:bg-[#1A1B1F] text-gray-600 dark:text-gray-400"
            }`}
        >
          <Heart className={`w-5 h-5 ${hasLiked ? "fill-red-500" : ""}`} />
          <span className="text-sm font-bold">{likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl transition-all duration-300 ${showComments ? "bg-[#0F82FF]/10 text-[#0F82FF]" : "hover:bg-gray-200 dark:hover:bg-[#1A1B1F] text-gray-600 dark:text-gray-400"
            }`}
        >
          <MessageCircle className={`w-5 h-5 ${showComments ? "fill-[#0F82FF]/20" : ""}`} />
          <span className="text-sm font-bold">{commentCount}</span>
        </button>

        <button className="flex items-center gap-2.5 px-4 py-2 rounded-2xl hover:bg-gray-200 dark:hover:bg-[#1A1B1F] text-gray-600 dark:text-gray-400 transition-all duration-300 ml-auto group">
          <Share2 className="w-5 h-5 group-hover:text-[#B44CFF] transition-colors" />
        </button>
      </div>

      {/* 💬 Comments Section */}
      {showComments && (
        <div className="px-6 pb-6 pt-2 bg-gray-50/30 dark:bg-black/10 border-t border-gray-100 dark:border-[#2F2F3A]/30">
          <CommentForm postId={post._id} />
          <div className="mt-4">
            <CommentList postId={post._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;



































