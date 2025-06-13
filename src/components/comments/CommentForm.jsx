import React, { useState } from "react";
import { createComment } from "../../api/comments";
import { useSocket } from "../../context/SocketContext"; // ✅

const CommentForm = ({ postId }) => {
  const [text, setText] = useState("");
  const socket = useSocket(); // ✅

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const newComment = await createComment({ postId, text });
      socket.emit("newComment", {
        postId,
        comment: newComment,
      });
      setText("");
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 flex-1"
        placeholder="Write a comment..."
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        comment
      </button>
    </form>
  );
};

export default CommentForm;






