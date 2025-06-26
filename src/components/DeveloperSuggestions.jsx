// src/components/DeveloperSuggestions.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import API from "../api";
import { followUser, unfollowUser } from "../api/followApi";

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

  // ✅ Friend request mutation
  const sendFriendRequest = useMutation({
    mutationFn: async (toUserId) => {
      await API.post(`/request/send/interested/${toUserId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dev-suggestions"]);
    },
    onError: () => alert("Something went wrong"),
  });

  // ✅ Follow/Unfollow mutation
  const toggleFollow = useMutation({
    mutationFn: async ({ toUserId, isFollowing }) => {
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

  if (isLoading) return <p className="text-gray-500">Loading suggestions...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Developers you may know</h2>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions available</p>
      ) : (
        suggestions.map((dev) => (
          <div
            key={dev._id}
            className="flex items-center justify-between border p-2 rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <img
                src={
                  dev.photoUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${dev.firstName}`
                }
                alt={dev.firstName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">
                  {dev.firstName} {dev.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* ✅ Follow/Unfollow */}
              <button
                onClick={() =>
                  toggleFollow.mutate({ toUserId: dev._id, isFollowing: dev.isFollowing })
                }
                disabled={toggleFollow.isLoading && loadingUserId === dev._id}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                {dev.isFollowing ? "Unfollow" : "Follow"}
              </button>

              {/* ✅ Add Friend */}
              <button
                onClick={() => sendFriendRequest.mutate(dev._id)}
                disabled={sendFriendRequest.isLoading && loadingUserId === dev._id}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
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

