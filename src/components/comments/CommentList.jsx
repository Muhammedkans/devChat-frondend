import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../api/comments";
import CommentItem from "./CommentItem";
import { useSocket } from "../../context/SocketContext";

const CommentList = ({ postId }) => {
  const { socket } = useSocket();

  const [comments, setComments] = useState([]);

  // ✅ Initial comment fetch using React Query
  const {
    data: fetchedComments = [],
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  // ✅ Set fetched comments ONLY once when data is loaded successfully
  useEffect(() => {
    if (isSuccess) {
      setComments(fetchedComments); // This will run only once per fetch
    }
  }, [isSuccess, fetchedComments]);

  // ✅ Socket handler for new comments
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (incoming) => {
      if (incoming.postId === postId) {
        setComments((prev) => {
          const exists = prev.some((c) => c._id === incoming.comment._id);
          if (exists) return prev;
          return [incoming.comment, ...prev];
        });
      }
    };

    socket.on("newComment", handleNewComment);
    return () => {
      socket.off("newComment", handleNewComment);
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






