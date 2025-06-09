
// src/components/comments/CommentList.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "../../api/comments";
import CommentItem from "./CommentItem";

const CommentList = ({ postId }) => {
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

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
