import API from "../api";

// src/api/comments.js


export const fetchComments = async (postId) => {
  const res = await API.get(`/posts/${postId}/comments`);
  return res.data.data;
};

export const createComment = async ({ postId, text }) => {
  const res = await API.post(`/posts/${postId}/comment`, { text });
  return res.data.data;
};