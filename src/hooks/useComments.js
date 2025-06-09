
// src/hooks/useComments.js (optional abstraction)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchComments, createComment } from "../api/comments";

 const useComments = (postId) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const mutation = useMutation({
    mutationFn: (text) => createComment({ postId, text }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", postId]);
    },
  });

  return { query, mutation };
};

export default useComments