import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSingleUser = async (userId) => {
  const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
    withCredentials: true,
  });
  return data;
};

const useSingleUser = (userId) => {
  return useQuery(["singleUser", userId], () => fetchSingleUser(userId));
};

export default useSingleUser;
