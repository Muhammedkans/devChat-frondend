// src/hooks/useUserPosts.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API function with error handling
const fetchUserPosts = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
    { withCredentials: true }
  );

  return response.data?.data || []; // Just return the actual posts
};

// React Query hook
const useUserPosts = (userId) => {
  return useQuery({
    queryKey: ["userPosts", userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId, // Prevents running on undefined/null
    staleTime: 1000 * 60 * 5, // Cache valid for 5 minutes
    retry: 1, // Optional: only retry once on failure
  });
};

export default useUserPosts;

