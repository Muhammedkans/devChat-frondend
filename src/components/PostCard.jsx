import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import useMyProfile from "../hooks/useMyProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../api/postLike";
import { useSocket } from "../context/SocketContext";

const PostCard = ({ post }) => {
  const { data: myUser } = useMyProfile();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes || []);

  const hasLiked = myUser?._id && localLikes.includes(myUser._id);

  // ✅ 1. Real-time updates from socket
  useEffect(() => {
    if (!socket) return;

    const handleLikeUpdate = ({ postId, userId, action }) => {
      if (postId !== post._id) return;

      setLocalLikes((prevLikes) => {
        if (action === "like" && !prevLikes.includes(userId)) {
          return [...prevLikes, userId];
        } else if (action === "unlike") {
          return prevLikes.filter((id) => id !== userId);
        }
        return prevLikes;
      });
    };

    socket.on("likeUpdate", handleLikeUpdate);

    return () => {
      socket.off("likeUpdate", handleLikeUpdate);
    };
  }, [socket, post._id]);

  // ✅ 2. Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: ({ hasLiked }) =>
      hasLiked ? unlikePost(post._id) : likePost(post._id),
    onSuccess: (_, variables) => {
      socket?.emit("likeUpdate", {
        postId: post._id,
        userId: myUser._id,
        action: variables.hasLiked ? "unlike" : "like",
      });
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // ✅ 3. Immediate optimistic update
  const handleLike = () => {
    if (!myUser?._id) return;

    const currentlyLiked = localLikes.includes(myUser._id);

    // 🔥 Optimistically update UI
    setLocalLikes((prev) =>
      currentlyLiked
        ? prev.filter((id) => id !== myUser._id)
        : [...prev, myUser._id]
    );

    // 🔄 Trigger mutation + emit socket
    likeMutation.mutate({ hasLiked: currentlyLiked });
  };

  return (
    <div className="border border-gray-300 rounded-xl p-4 shadow-sm bg-white">
      <div className="flex items-center mb-2">
        <img
          src={post.user?.photoUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-bold">{post.user?.firstName}</p>
          <p className="text-sm text-gray-500">
            {post.createdAt?.slice(0, 10)}
          </p>
        </div>
      </div>

      {post?.contentText && (
        <p className="mb-3 text-gray-800">{post.contentText}</p>
      )}
      {post?.contentImageUrl && (
        <img
          src={post.contentImageUrl}
          alt="Post"
          className="w-full rounded-md mb-3"
        />
      )}

      <div className="flex items-center space-x-4">
        <button onClick={handleLike}>
          {hasLiked ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-xl" />
          )}
        </button>
        <span>{localLikes.length}</span>

        <button onClick={() => setShowComments(!showComments)}>
          <FaRegComment className="text-xl" />
        </button>
        <span>{post.comments?.length || 0}</span>
      </div>

      {showComments && (
        <div className="mt-4">
          <CommentForm postId={post._id} />
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;











