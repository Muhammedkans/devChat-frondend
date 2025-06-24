// src/components/comments/CommentList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../api/comments";
import CommentItem from "./CommentItem";
import { useSocket } from "../../context/SocketContext";

const CommentList = ({ postId }) => {
  const { socket } = useSocket();
  const [comments, setComments] = useState([]);

  // ✅ Fetch all comments for the post
  const { data: fetchedComments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ✅ Avoid infinite loop: compare previous and new comments
  useEffect(() => {
    setComments((prev) => {
      const oldStr = JSON.stringify(prev);
      const newStr = JSON.stringify(fetchedComments);
      if (oldStr === newStr) return prev;
      return fetchedComments;
    });
  }, [fetchedComments]);

  // ✅ Real-time comment updates using socket
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = ({ postId: incomingPostId, comment }) => {
      if (incomingPostId !== postId) return;

      setComments((prev) => {
        const alreadyExists = prev.some((c) => c._id === comment._id);
        if (alreadyExists) return prev;
        return [comment, ...prev];
      });
    };

    socket.on("newComment", handleNewComment);
    return () => socket.off("newComment", handleNewComment);
  }, [socket, postId]);

  // ✅ Memoized rendering for performance
  const renderedComments = useMemo(() => {
    return comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((comment) => <CommentItem key={comment._id} comment={comment} />);
  }, [comments]);

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading comments...</p>;
  }

  return <div className="space-y-4 mt-4">{renderedComments}</div>;
};

export default CommentList;



















