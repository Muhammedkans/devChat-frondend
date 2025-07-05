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
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setComments((prev) => {
      const oldStr = JSON.stringify(prev);
      const newStr = JSON.stringify(fetchedComments);
      if (oldStr === newStr) return prev;
      return fetchedComments;
    });
  }, [fetchedComments]);

  // ✅ Real-time comment updates
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = ({ postId: incomingPostId, comment }) => {
      if (incomingPostId !== postId) return;
      setComments((prev) => {
        const exists = prev.some((c) => c._id === comment._id);
        if (exists) return prev;
        return [comment, ...prev];
      });
    };

    socket.on("newComment", handleNewComment);
    return () => socket.off("newComment", handleNewComment);
  }, [socket, postId]);

  const renderedComments = useMemo(() => {
    return comments
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((comment) => (
        <div
          key={comment._id}
          className="bg-[#1f1f29] text-gray-200 p-3 rounded-xl shadow-inner border border-[#33334d] backdrop-blur-sm"
        >
          <CommentItem comment={comment} />
        </div>
      ));
  }, [comments]);

  if (isLoading) {
    return (
      <p className="text-sm text-purple-300 bg-[#1a1a25] p-3 rounded-xl">
        Loading comments...
      </p>
    );
  }

  return <div className="space-y-3 mt-4">{renderedComments}</div>;
};

export default CommentList;




















