// src/api/comments.js
import API from "../api";

// ✅ Fetch all comments for a post
export const fetchComments = async (postId) => {
  try {
    const response = await API.get(`/posts/${postId}/comments`);
    return response.data?.data || []; // fallback to empty array
  } catch (error) {
    console.error("❌ Failed to fetch comments", error?.response?.data || error.message);
    throw error;
  }
};

// ✅ Create a new comment
export const createComment = async ({ postId, text }) => {
  try {
    const response = await API.post(`/posts/${postId}/comment`, { text });
    return response.data?.data;
  } catch (error) {
    console.error("❌ Failed to create comment", error?.response?.data || error.message);
    throw error;
  }
};

