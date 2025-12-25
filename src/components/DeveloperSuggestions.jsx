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
      <div className="flex items-center justify-between px-2 mb-2">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Search className="w-3 h-3 text-[#0F82FF]" />
          Scouted Talent
        </h2>
        <span className="text-[9px] font-bold text-white bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] px-2 py-0.5 rounded-full shadow-lg shadow-blue-500/20">
          FEATURED
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white/40 dark:bg-[#1A1B1F]/40 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-[#2F2F3A] backdrop-blur-md">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest animate-pulse">Scanning Network...</p>
          </div>
        ) : (
          suggestions.map((dev) => (
            <div
              key={dev._id}
              className="group relative flex flex-col p-4 bg-white dark:bg-[#13141F] rounded-[1.5rem] border border-gray-100 dark:border-[#2F2F3A] shadow-sm hover:shadow-xl hover:border-[#0F82FF]/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Profile Bio Section */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative cursor-pointer shrink-0" onClick={() => navigate(`/users/${dev._id}`)}>
                  <div className="absolute inset-0 bg-[#0F82FF] blur opacity-0 group-hover:opacity-40 transition-opacity rounded-xl"></div>
                  <img
                    src={dev.photoUrl}
                    alt={dev.firstName}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-[#2F2F3A] shadow-md relative z-10"
                  />
                  {dev.isPremium && (
                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 p-0.5 rounded-full border border-white shadow-sm z-20">
                      <ShieldCheck className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p
                      onClick={() => navigate(`/users/${dev._id}`)}
                      className="text-sm font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-[#0F82FF] transition-colors"
                    >
                      {dev.firstName} {dev.lastName}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {dev.about || "Building the future."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleFollow.mutate({ toUserId: dev._id, isFollowing: dev.isFollowing })}
                  disabled={toggleFollow.isLoading && loadingUserId === dev._id}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold transition-all border ${dev.isFollowing
                    ? "bg-transparent border-gray-200 dark:border-[#2F2F3A] text-gray-500 hover:text-red-500 hover:border-red-200"
                    : "bg-[#0F82FF]/5 border-[#0F82FF]/10 text-[#0F82FF] hover:bg-[#0F82FF] hover:text-white"
                    }`}
                >
                  {dev.isFollowing ? "Unfollow" : "Follow"}
                </button>

                <button
                  onClick={() => sendFriendRequest.mutate(dev._id)}
                  disabled={sendFriendRequest.isLoading && loadingUserId === dev._id}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  <Users className="w-3 h-3" />
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







