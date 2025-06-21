import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import useMyProfile from "../hooks/useMyProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "../api/postLike";
import { useSocket } from "../context/SocketContext";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const { data: myUser } = useMyProfile();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const hasLiked = myUser?._id && likes.includes(myUser._id);

  // ✅ Listen for like updates (real-time)
  useEffect(() => {
    if (!socket) return;

    const handleLikeUpdate = ({ postId, userId, action }) => {
      if (postId !== post._id) return;

      setLikes((prevLikes) => {
        if (action === "like" && !prevLikes.includes(userId)) {
          return [...prevLikes, userId];
        }
        if (action === "unlike") {
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

  // ✅ Listen for comment count updates (real-time)
  useEffect(() => {
    if (!socket) return;

    const handleCommentCountUpdate = ({ postId, commentCount }) => {
      if (postId === post._id) {
        setCommentCount(commentCount);
      }
    };

    socket.on("commentCountUpdate", handleCommentCountUpdate);

    return () => {
      socket.off("commentCountUpdate", handleCommentCountUpdate);
    };
  }, [socket, post._id]);

  // ✅ Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: ({ hasLiked }) =>
      hasLiked ? unlikePost(post._id) : likePost(post._id),
    onSuccess: (_, variables) => {
      if (socket && myUser?._id) {
        socket.emit("likeUpdate", {
          postId: post._id,
          userId: myUser._id,
          action: variables.hasLiked ? "unlike" : "like",
        });

        const updatedLikes = variables.hasLiked
          ? post.likes.filter((id) => id !== myUser._id)
          : [...post.likes, myUser._id];

        socket.emit("likeUpdated", {
          ...post,
          likes: updatedLikes,
        });
      }

      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleLike = () => {
    if (!myUser?._id) return;

    const liked = likes.includes(myUser._id);
    setLikes((prev) =>
      liked ? prev.filter((id) => id !== myUser._id) : [...prev, myUser._id]
    );

    likeMutation.mutate({ hasLiked: liked });
  };

  const isMyPost = myUser?._id === post.user?._id;
  const profileLink = isMyPost ? "/profile" : `/users/${post.user?._id}`;

  return (
    <div className="border rounded-lg bg-white shadow-sm mb-6">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          to={profileLink}
          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
        >
          <img
            src={post.user?.photoUrl}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{post.user?.firstName}</p>
            <p className="text-xs text-gray-500">
              {post.createdAt?.slice(0, 10)}
            </p>
          </div>
        </Link>
      </div>

      {/* Post Content */}
      {post.contentText && (
        <p className="px-4 text-sm mb-2">{post.contentText}</p>
      )}
      {post.contentImageUrl && (
        <img
          src={post.contentImageUrl}
          alt="Post"
          className="w-full max-h-[500px] object-cover"
        />
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
          <CommentForm postId={post._id} />
          <CommentList postId={post._id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;






















