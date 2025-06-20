// src/components/comments/CommentItem.jsx
import React from "react";

const CommentItem = ({ comment }) => {
  const {
    user = {},
    text = "",
    createdAt = new Date(),
  } = comment;

  return (
    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
      <div className="flex items-center mb-1">
        <img
          src={
            user.photoUrl ||
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt="User"
          className="w-8 h-8 rounded-full mr-2 object-cover"
        />
        <strong className="text-sm text-gray-800">
          {user.firstName} {user.lastName}
        </strong>
      </div>
      <p className="text-sm text-gray-700">{text}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default CommentItem;

