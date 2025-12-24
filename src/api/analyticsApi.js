import API from "../api";

export const recordProfileView = async (userId) => {
  const response = await API.post(`/profile/view/${userId}`);
  return response.data;
};

export const getProfileAnalytics = async () => {
  const response = await API.get("/profile/analytics");
  return response.data;
};
