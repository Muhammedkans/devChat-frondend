// src/components/comments/CommentForm.jsx
import React, { useState } from "react";
import { createComment } from "../../api/comments";
import { useSocket } from "../../context/SocketContext";
import useMyProfile from "../../hooks/useMyProfile";

const CommentForm = ({ postId }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { data: user } = useMyProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed || !user || loading) return;

    try {
      setLoading(true);

      // ✅ Save to backend
      const savedComment = await createComment({ postId, text: trimmed });

      // ✅ Emit real-time to socket
      if (socket && savedComment) {
        socket.emit("newComment", {
          postId,
          comment: savedComment,
        });
      }

      setText(""); // ✅ Clear input
    } catch (err) {
      console.error("❌ Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 rounded flex-1 text-sm"
        placeholder="Write a comment..."
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Posting..." : "Comment"}
      </button>
    </form>
  );
};

export default CommentForm;

















