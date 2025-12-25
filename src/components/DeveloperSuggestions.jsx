import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { followUser, unfollowUser } from "../api/followApi";
import { UserPlus, UserMinus, Users, ShieldCheck, Search } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import useMyProfile from "../hooks/useMyProfile";
import toast from "react-hot-toast";

const DeveloperSuggestions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { data: myProfile } = useMyProfile();
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

      // 🤝 Emit Real-time Socket Event
      if (socket) {
        socket.emit("sendConnectionRequest", {
          toUserId,
          fromUser: {
            _id: myProfile._id,
            firstName: myProfile.firstName,
            lastName: myProfile.lastName,
            photoUrl: myProfile.photoUrl
          }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dev-suggestions"]);
      toast.success("Connection request sent!");
    },
    onError: () => toast.error("Something went wrong"),
  });

  const toggleFollow = useMutation({
    mutationFn: async ({ toUserId, isFollowing }) => {
      setLoadingUserId(toUserId);
      if (isFollowing) await unfollowUser(toUserId);
      else await followUser(toUserId);
    },
    onSuccess: () => queryClient.invalidateQueries(["dev-suggestions"]),
    onError: () => toast.error("Something went wrong"),
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-20 bg-gray-100 dark:bg-[#1A1B1F] rounded-2xl animate-pulse"></div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
          <Search className="w-4 h-4 text-[#0F82FF]" />
          Tech Talent
        </h2>
        <span className="text-[10px] font-bold text-[#0F82FF] bg-[#0F82FF10] px-2 py-0.5 rounded-full uppercase">
          New
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-[#1A1B1F]/50 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-[#2F2F3A]">
            <p className="text-xs font-bold text-gray-400 uppercase">Searching Area...</p>
          </div>
        ) : (
          suggestions.map((dev) => (
            <div
              key={dev._id}
              className="group relative flex flex-col p-5 bg-white dark:bg-[#13141F] rounded-[2rem] border border-gray-100 dark:border-[#2F2F3A] hover:border-[#0F82FF50] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Profile Bio Section */}
              <div className="flex items-start gap-4">
                <div className="relative cursor-pointer" onClick={() => navigate(`/users/${dev._id}`)}>
                  <img
                    src={dev.photoUrl}
                    alt={dev.firstName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-100 dark:border-[#2F2F3A] group-hover:border-[#0F82FF] transition-colors"
                  />
                  {dev.isPremium && (
                    <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full border border-white">
                      <ShieldCheck className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                    {dev.firstName} {dev.lastName}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                    {dev.about || "Tech Enthusiast"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => toggleFollow.mutate({ toUserId: dev._id, isFollowing: dev.isFollowing })}
                  disabled={toggleFollow.isLoading && loadingUserId === dev._id}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold transition-all ${dev.isFollowing
                      ? "bg-gray-100 dark:bg-[#2F2F3A] text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:text-red-500"
                      : "bg-[#0F82FF10] text-[#0F82FF] hover:bg-[#0F82FF] hover:text-white"
                    }`}
                >
                  {dev.isFollowing ? <UserMinus className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {dev.isFollowing ? "Unfollow" : "Follow"}
                </button>

                <button
                  onClick={() => sendFriendRequest.mutate(dev._id)}
                  disabled={sendFriendRequest.isLoading && loadingUserId === dev._id}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0F82FF] to-[#0F82FFCC] text-white text-[10px] font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all active:scale-95"
                >
                  <Users className="w-3.5 h-3.5" />
                  Connect
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeveloperSuggestions;







