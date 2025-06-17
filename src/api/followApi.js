// src/api/followApi.js
import axios from "axios";
import API from "../api";

export const followUser = async (userId) => {
  const response = await API.post(`/users/${userId}/follow`, {}, { withCredentials: true });
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await API.delete(`/users/${userId}/unfollow`, { withCredentials: true });
  return response.data;
};
