import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import API from "../api";
import { followUser, unfollowUser } from "../api/followApi";
import { HiUserPlus, HiUserMinus, HiUserGroup } from "react-icons/hi2";

const DeveloperSuggestions = () => {
  const queryClient = useQueryClient();
  const [loadingUserId, setLoadingUserId] = useState(null);

  // ✅ Fetch suggestions
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["dev-suggestions"],
    queryFn: async () => {
      const res = await API.get("/request/suggestions");
      return res.data.suggestions;
    },
  });

  // ✅ Friend Request Mutation
  const sendFriendRequest = useMutation({
    mutationFn: async (toUserId) => {
      setLoadingUserId(toUserId);
      await API.post(`/request/send/interested/${toUserId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dev-suggestions"]);
    },
    onError: () => alert("Something went wrong"),
  });

  // ✅ Follow/Unfollow Mutation
  const toggleFollow = useMutation({
    mutationFn: async ({ toUserId, isFollowing }) => {
      setLoadingUserId(toUserId);
      if (isFollowing) {
        await unfollowUser(toUserId);
      } else {
        await followUser(toUserId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dev-suggestions"]);
    },
    onError: () => alert("Something went wrong"),
  });

  if (isLoading) return <p className="text-sm text-gray-400">Loading suggestions...</p>;

  return (
    <div className="bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 text-gray-900 p-4 rounded-xl shadow-md space-y-4 overflow-y-auto max-h-[80vh]">
      <h2 className="text-lg font-bold border-b pb-2 border-purple-300">
        Developers You May Know
      </h2>

      {suggestions.length === 0 ? (
        <p className="text-gray-600 text-sm">No suggestions available</p>
      ) : (
        suggestions.map((dev) => (
          <div
            key={dev._id}
            className="flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow"
          >
            {/* Profile & Info */}
            <div className="flex items-center gap-3">
              <img
                src={
                  dev.photoUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${dev.firstName}`
                }
                alt={dev.firstName}
                className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {dev.firstName} {dev.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {dev.about || "No bio available"}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() =>
                  toggleFollow.mutate({ toUserId: dev._id, isFollowing: dev.isFollowing })
                }
                disabled={toggleFollow.isLoading && loadingUserId === dev._id}
                className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 transition ${
                  dev.isFollowing
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {dev.isFollowing ? <HiUserMinus /> : <HiUserPlus />}
                {dev.isFollowing ? "Unfollow" : "Follow"}
              </button>

              <button
                onClick={() => sendFriendRequest.mutate(dev._id)}
                disabled={sendFriendRequest.isLoading && loadingUserId === dev._id}
                className="px-3 py-1 text-xs rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 transition"
              >
                <HiUserGroup />
                Add Friend
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeveloperSuggestions;



