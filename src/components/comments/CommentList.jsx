import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../api/comments";
import CommentItem from "./CommentItem";
import { useSocket } from "../../context/SocketContext"; // ✅

const CommentList = ({ postId }) => {
  const { data: initialComments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { socket } = useSocket(); // ✅ FIXED

  const [comments, setComments] = useState([]);

  // ✅ Set initial comments on load
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // ✅ Socket listener for newComment
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (incoming) => {
      if (incoming.postId === postId) {
        setComments((prev) => [incoming.comment, ...prev]);
      }
    };

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment); // Cleanup
    };
  }, [socket, postId]);

  if (isLoading) return <p className="text-sm text-gray-500">Loading comments...</p>;

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;






