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
    "https://api.dicebear.com/7.x/initials/svg?seed=" + user.firstName;

  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));

  return (
    <div className="flex items-start gap-3">
      {/* 👤 Avatar */}
      <img
        src={profileImg}
        alt={fullName}
        className="w-10 h-10 rounded-full object-cover border border-purple-400 shadow"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://api.dicebear.com/7.x/initials/svg?seed=User";
        }}
      />

      {/* 💬 Comment Content */}
      <div className="flex-1 bg-[#1f1f29] text-gray-200 p-3 rounded-xl border border-[#33334d] backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between">
          <strong className="text-sm text-purple-200">{fullName || "Anonymous"}</strong>
          <span className="text-xs text-gray-400">{formattedTime}</span>
        </div>

        <p className="mt-1 text-sm text-gray-100 break-words">{text}</p>
      </div>
    </div>
  );
};

export default CommentItem;





