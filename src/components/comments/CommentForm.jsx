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
      const savedComment = await createComment({ postId, text: trimmed });
      if (socket && savedComment) {
        socket.emit("newComment", {
          postId,
          comment: savedComment,
        });
      }
      setText("");
    } catch (err) {
      console.error("❌ Failed to post comment", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 mt-3 items-center w-full"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-[#2b2b33] text-white placeholder-gray-400 border border-[#444657] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        placeholder="Write a comment..."
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Posting..." : "Comment"}
      </button>
    </form>
  );
};

export default CommentForm;

















