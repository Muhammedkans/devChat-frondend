// src/pages/CommentPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import CommentList from "../components/comments/CommentList";
import CommentForm from "../components/comments/CommentForm";

const CommentPage = () => {
  const { postId } = useParams();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <CommentForm postId={postId} />
      <CommentList postId={postId} />
    </div>
  );
};

export default CommentPage;