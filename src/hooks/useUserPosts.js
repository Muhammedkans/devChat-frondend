import { useQuery } from "@tanstack/react-query";
import API from "../api";

const useUserProfile = (userId) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const res = await API.get(`/users/${userId}`, {
        withCredentials: true,
      });
      return res.data; // assuming res.data is the user object
    },
    enabled: !!userId, // don't run if userId is falsy
    staleTime: 1000 * 60 * 5, // optional: cache result for 5 min
  });
};

export default useUserProfile;