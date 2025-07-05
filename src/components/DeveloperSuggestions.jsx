import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import API from "../api";
import { followUser, unfollowUser } from "../api/followApi";
import { HiUserPlus, HiUserMinus, HiUserGroup } from "react-icons/hi2";

const DeveloperSuggestions = () => {
  const queryClient = useQueryClient();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["dev-suggestions"],
    queryFn: async () => {
      const res = await API.get("/request/suggestions");
      return res.data.suggestions;
    },
  });

  const sendFriendRequest = useMutation({
    mutationFn: async (toUserId) => {
      setLoadingUserId(toUserId);
      await API.post(`/request/send/interested/${toUserId}`);
    },
    onSuccess: () => queryClient.invalidateQueries(["dev-suggestions"]),
    onError: () => alert("Something went wrong"),
  });

  const toggleFollow = useMutation({
    mutationFn: async ({ toUserId, isFollowing }) => {
      setLoadingUserId(toUserId);
      if (isFollowing) await unfollowUser(toUserId);
      else await followUser(toUserId);
    },
    onSuccess: () => queryClient.invalidateQueries(["dev-suggestions"]),
    onError: () => alert("Something went wrong"),
  });

  if (isLoading) return <p className="text-sm text-gray-400">Loading suggestions...</p>;

  return (
    <div className="bg-[#1A1B1F] border border-[#2F2F3A] p-4 rounded-2xl shadow-[0_0_20px_#0F82FF22] text-white backdrop-blur-md space-y-4 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-semibold border-b border-[#333] pb-2 text-[#0F82FF]">
        Developers You May Know
      </h2>

      {suggestions.length === 0 ? (
        <p className="text-gray-400 text-sm">No suggestions available</p>
      ) : (
        suggestions.map((dev) => (
          <div
            key={dev._id}
            className="flex items-center gap-4 bg-[#22232A] border border-[#2F2F3A] rounded-xl p-4 shadow hover:shadow-lg transition duration-300"
          >
            {/* Profile Image */}
            <img
              src={
                dev.photoUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${dev.firstName}`
              }
              alt={dev.firstName}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#0F82FF]"
            />

            {/* Center content: Name, Bio, Buttons */}
            <div className="flex flex-col flex-1">
              <p className="font-semibold text-white text-sm">
                {dev.firstName} {dev.lastName}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                {dev.about || "No bio available"}
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    toggleFollow.mutate({ toUserId: dev._id, isFollowing: dev.isFollowing })
                  }
                  disabled={toggleFollow.isLoading && loadingUserId === dev._id}
                  className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 transition-all duration-200 ${
                    dev.isFollowing
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] hover:brightness-110 text-white"
                  }`}
                >
                  {dev.isFollowing ? <HiUserMinus /> : <HiUserPlus />}
                  {dev.isFollowing ? "Unfollow" : "Follow"}
                </button>

                <button
                  onClick={() => sendFriendRequest.mutate(dev._id)}
                  disabled={sendFriendRequest.isLoading && loadingUserId === dev._id}
                  className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-green-500 to-lime-500 hover:brightness-110 text-white flex items-center gap-1 transition"
                >
                  <HiUserGroup />
                  Add Friend
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DeveloperSuggestions;







