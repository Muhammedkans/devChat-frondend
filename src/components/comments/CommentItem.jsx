// src/components/comments/CommentItem.jsx
import React from "react";

const CommentItem = ({ comment }) => {
  const {
    user = {},
    text = "",
    createdAt = new Date(),
  } = comment;

  const fullName = `${user.firstName || "User"} ${user.lastName || ""}`.trim();

  const profileImg =
    user.photoUrl ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));

  return (
    <div className="bg-gray-100 p-3 rounded-md shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <img
          src={profileImg}
          alt={fullName}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
          }}
        />
        <strong className="text-sm text-gray-800">
          {fullName || "Anonymous"}
        </strong>
      </div>
      <p className="text-sm text-gray-700 break-words">{text}</p>
      <p className="text-xs text-gray-500 mt-1">{formattedTime}</p>
    </div>
  );
};

export default CommentItem;




