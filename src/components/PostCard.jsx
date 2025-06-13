import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import useMyProfile from "../hooks/useMyProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../api/postLike"
import { useSocket } from "../context/SocketContext";

const PostCard = ({ post }) => {
  console.log(post)
  const { data: myUser } = useMyProfile();
  const queryClient = useQueryClient();
  const socket = useSocket(); // 🔌 socket context

  const [showComments, setShowComments] = useState(false);

  const hasLiked = post.likes.includes(myUser?._id);

  const likeMutation = useMutation({
    mutationFn: () =>
      hasLiked ? unlikePost(post._id) : likePost(post._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]); // refresh feed

      // 🔌 Emit real-time like/unlike
      socket?.emit("likeUpdate", {
        postId: post._id,
        userId: myUser?._id,
        action: hasLiked ? "unlike" : "like",
      });
    },
  });

  const handleLike = () => {
    if (!myUser?._id) return;
    likeMutation.mutate();
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
          <p className="text-sm text-gray-500">{post.createdAt?.slice(0, 10)}</p>
        </div>
      </div>

      {/* Post Content */}
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

      {/* Like & Comment Buttons */}
      <div className="flex items-center space-x-4">
        <button onClick={handleLike}>
          {hasLiked ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-xl" />
          )}
        </button>
        <span>{post.likes.length}</span>

        <button onClick={() => setShowComments(!showComments)}>
          <FaRegComment className="text-xl" />
        </button>
        <span>{post.comments?.length || 0}</span>
      </div>

      {/* Comment Section */}
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





