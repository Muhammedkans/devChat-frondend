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

  // ✅ Real-time Like updates
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

  // ✅ Real-time comment count update
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

  // ✅ Like mutation (async)
  const likeMutation = useMutation({
    mutationFn: ({ hasLiked }) =>
      hasLiked ? unlikePost(post._id) : likePost(post._id),
  });

  const handleLike = () => {
    if (!myUser?._id) return;

    const alreadyLiked = likes.includes(myUser._id);

    // 👉 Instant UI update
    setLikes((prev) =>
      alreadyLiked ? prev.filter((id) => id !== myUser._id) : [...prev, myUser._id]
    );

    // 👉 Emit immediately
    if (socket) {
      socket.emit("likeUpdate", {
        postId: post._id,
        userId: myUser._id,
        action: alreadyLiked ? "unlike" : "like",
      });
    }

    // 👉 Async backend call
    likeMutation.mutate({ hasLiked: alreadyLiked });
  };

  const isMyPost = myUser?._id === post.user?._id;
  const profileLink = isMyPost ? "/profile" : `/users/${post.user?._id || ""}`;

  const profileImage =
    post.user?.photoUrl ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  return (
    <div className="border rounded-lg bg-white shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={profileLink} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded">
          <img src={profileImage} alt="User" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <p className="font-semibold text-sm">{post.user?.firstName}</p>
            <p className="text-xs text-gray-500">{post.createdAt?.slice(0, 10)}</p>
          </div>
        </Link>
      </div>

      {/* Post Content */}
      {post.contentText && <p className="px-4 text-sm mb-2">{post.contentText}</p>}
      {post.contentImageUrl && (
        <img src={post.contentImageUrl} alt="Post" className="w-full max-h-[500px] object-cover" />
      )}

      {/* Actions */}
      <div className="flex items-center px-4 py-2 gap-5">
        <button onClick={handleLike}>
          {hasLiked ? (
            <FaHeart className="text-red-500 text-2xl" />
          ) : (
            <FaRegHeart className="text-2xl" />
          )}
        </button>
        <span className="text-sm">{likes.length}</span>

        <button onClick={() => setShowComments((s) => !s)}>
          <FaRegComment className="text-2xl" />
        </button>
        <span className="text-sm">{commentCount}</span>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="px-4 pb-4">
          <CommentForm postId={post._id} /> {/* ✅ FIXED: removed manual +1 */}
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
































