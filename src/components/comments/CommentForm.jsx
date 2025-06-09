
// src/components/comments/CommentForm.jsx
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment} from "../../api/comments";

const CommentForm = ({ postId }) => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => createComment({ postId, text }),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Comment
      </button>
    </form>
  );
};

export default CommentForm;