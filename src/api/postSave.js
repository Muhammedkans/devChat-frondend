import API from "../api";

export const savePost = async (postId) => {
  const response = await API.post(`/posts/${postId}/save`);
  return response.data;
};

export const unsavePost = async (postId) => {
  const response = await API.delete(`/posts/${postId}/save`);
  return response.data;
};

export const getSavedPosts = async () => {
  const response = await API.get("/posts/saved");
  return response.data;
};
