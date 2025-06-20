import React, { useState } from "react";
import { createComment } from "../../api/comments";
import { useSocket } from "../../context/SocketContext"; // ✅

const CommentForm = ({ postId }) => {
  const [text, setText] = useState("");
  const { socket } = useSocket(); // ✅ FIX: use destructured socket

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const newComment = await createComment({ postId, text });

      // ✅ Emit new comment to socket
      if (socket) {
        socket.emit("newComment", {
          postId,
          comment: newComment,
        });
      }

      setText("");
    } catch (error) {
      console.error("❌ Failed to post comment", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded flex-1 text-sm"
        placeholder="Write a comment..."
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Comment
      </button>
    </form>
  );
};

export default CommentForm;







