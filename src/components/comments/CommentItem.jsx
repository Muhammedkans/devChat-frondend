// src/components/comments/CommentItem.jsx
import React from "react";

const CommentItem = ({ comment }) => {
  return (
    <div className="bg-gray-100 p-3 rounded">
      <div className="flex items-center mb-1">
        <img
          src={comment.user?.photoUrl}
          alt=""
          className="w-8 h-8 rounded-full mr-2"
        />
        <strong>
          {comment.user?.firstName} {comment.user?.lastName}
        </strong>
      </div>
      <p className="text-sm text-gray-800">{comment.text}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(comment.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default CommentItem;
