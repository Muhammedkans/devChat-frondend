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

  const [comments, setComments] = useState(initialComments);
  const socket = useSocket(); // ✅

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    const handleNewComment = (incoming) => {
      if (incoming.postId === postId) {
        setComments((prev) => [incoming.comment, ...prev]);
      }
    };

    socket?.on("newComment", handleNewComment); // ✅

    return () => {
      socket?.off("newComment", handleNewComment); // ✅ cleanup
    };
  }, [socket, postId]);

  if (isLoading) return <p>Loading comments...</p>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;





