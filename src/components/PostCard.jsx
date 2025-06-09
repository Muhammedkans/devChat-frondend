// src/components/PostCard.jsx
import React, { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import useMyProfile from "../hooks/useMyProfile";
import API from "../api";
import CommentForm from "./comments/CommentForm";
import CommentList from "./comments/CommentList";

const PostCard = ({ post }) => {
  const { data: currentUser, isLoading: profileLoading } = useMyProfile();
  const [likes, setLikes] = useState(post.likes || []);
  const [showComments, setShowComments] = useState(false);

  if (profileLoading || !currentUser) return null;

  const isLiked = likes.includes(currentUser._id);

  const handleLikeToggle = async () => {
    try {
      if (isLiked) {
        setLikes((prev) => prev.filter((id) => id !== currentUser._id));
        await API.delete(`/posts/${post._id}/like`);
      } else {
        setLikes((prev) => [...prev, currentUser._id]);
        await API.post(`/posts/${post._id}/like`);
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      {/* 👤 Post User Info */}
      <div className="flex items-center mb-3">
        <img
          src={post.user?.photoUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h2 className="font-semibold text-lg">
          {post.user?.firstName} {post.user?.lastName}
        </h2>
      </div>

      {/* 📝 Post Text */}
      {post.contentText && (
        <p className="text-gray-700 mb-2">{post.contentText}</p>
      )}

      {/* 🖼️ Post Image */}
      {post.contentImageUrl && (
        <img
          src={post.contentImageUrl}
          alt="Post"
          className="w-full mt-2 rounded-xl object-cover"
        />
      )}

      {/* ❤️ Like & 💬 Comment Buttons */}
      <div className="flex items-center gap-4 mt-3">
        <button onClick={handleLikeToggle} className="hover:scale-110 transition">
          {isLiked ? (
            <Heart className="text-red-500 fill-red-500 w-5 h-5" />
          ) : (
            <Heart className="text-gray-500 w-5 h-5" />
          )}
        </button>
        <span className="text-sm text-gray-600">
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </span>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-sm text-gray-600 hover:text-blue-500"
        >
          <MessageCircle className="w-5 h-5 mr-1" />
          Comment
        </button>
      </div>

      {/* 💬 Comment Section */}
      {showComments && (
        <div className="mt-4 space-y-4">
          <CommentForm postId={post._id} />
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;



