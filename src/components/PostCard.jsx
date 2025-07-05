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

const PostCard = ({ post }) => {
  const { data: myUser } = useMyProfile();
  const { socket } = useSocket();

  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const hasLiked = myUser?._id && likes.includes(myUser._id);

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
    <div className="rounded-2xl border border-[#33364a] bg-[#1e1f24] backdrop-blur-md shadow-[0_0_10px_#0F82FF11] hover:shadow-[0_0_20px_#0F82FF33] transition-all duration-300 mb-6 text-white overflow-hidden">
      
      {/* 👤 User Info */}
      <div className="flex items-center justify-between px-5 py-4">
        <Link
          to={profileLink}
          className="flex items-center gap-4 hover:bg-[#2c2c34] p-2 rounded-lg transition"
        >
          <img
            src={profileImage}
            alt="User"
            className="w-11 h-11 rounded-full object-cover ring-2 ring-purple-400"
          />
          <div className="leading-tight">
            <p className="font-semibold text-sm text-white">
              {post.user?.firstName} {post.user?.lastName}
            </p>
            <p className="text-xs text-gray-400">{post.createdAt?.slice(0, 10)}</p>
          </div>
        </Link>
      </div>

      {/* 📝 Post Text */}
      {post.contentText && (
        <p className="px-5 pb-3 text-sm text-gray-200 whitespace-pre-wrap">
          {post.contentText}
        </p>
      )}

      {/* 🖼️ Post Image */}
      {post.contentImageUrl && (
        <img
          src={post.contentImageUrl}
          alt="Post"
          className="w-full max-h-[500px] object-cover rounded-md"
        />
      )}

      {/* ❤️ + 💬 Actions */}
      <div className="flex items-center px-5 py-3 gap-5 border-t border-[#2e2f3a] text-white">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          {hasLiked ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-lg" />
          )}
          <span className="text-sm">{likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-1 hover:text-blue-400 transition"
        >
          <FaRegComment className="text-lg" />
          <span className="text-sm">{commentCount}</span>
        </button>
      </div>

      {/* 💬 Comments Section */}
      {showComments && (
        <div className="px-5 pb-4 pt-2">
          <CommentForm postId={post._id} />
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;



































