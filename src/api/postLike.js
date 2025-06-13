import API from "../api"

// Like a post
export const likePost = async (postId) => {
  const res = await API.post(`/posts/${postId}/like`);
  return res.data.data;
};

// Unlike a post
export const unlikePost = async (postId) => {
  const res = await API.delete(`/posts/${postId}/like`);
  return res.data.data;
};
