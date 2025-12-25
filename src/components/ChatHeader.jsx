import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../context/SocketContext";
import { Circle, ChevronLeft, ShieldCheck, MoreVertical, Phone, Video } from "lucide-react";
import API from "../api";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ userId }) => {
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ["chatUser", userId],
    queryFn: async () => {
      const { data } = await API.get(`/users/${userId}`, {
        withCredentials: true,
      });
      return data.data || data;
    },
    enabled: !!userId,
  });

  const isOnline = onlineUsers.includes(userId);

  if (isLoading || !user) {
    return (
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-[#2F2F3A] bg-white dark:bg-[#10131A] animate-pulse">
        <div className="w-10 h-10 bg-gray-200 dark:bg-[#1A1B1F] rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="w-24 h-3 bg-gray-200 dark:bg-[#1A1B1F] rounded-full"></div>
          <div className="w-16 h-2 bg-gray-200 dark:bg-[#1A1B1F] rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2F2F3A] bg-white/70 dark:bg-[#10131A]/80 backdrop-blur-3xl sticky top-0 z-10 transition-all duration-500">
      <div className="flex items-center gap-4">
        {/* ⬅️ Back Button */}
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1A1B1F] text-gray-400 hover:text-[#0F82FF] transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* 👤 Profile Image */}
        <div className="relative group cursor-pointer" onClick={() => navigate(`/users/${user._id}`)}>
          <div className="absolute inset-0 bg-[#0F82FF] rounded-xl blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <img
            src={user.photoUrl}
            alt="User"
            className="w-11 h-11 rounded-xl object-cover border-2 border-white dark:border-[#1A1B1F] shadow-lg relative z-10"
          />
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 z-20 border-2 border-white dark:border-[#10131A] bg-green-500 w-3.5 h-3.5 rounded-full shadow-lg"></div>
          )}
        </div>

        {/* 👤 Identity Section */}
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">
              {user.firstName} {user.lastName}
            </h2>
            {user.isPremium && <ShieldCheck className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/20" />}
          </div>
          <p className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? "text-green-500" : "text-gray-400"}`}>
            {isOnline ? "Live Protocol" : "Standby Mode"}
          </p>
        </div>
      </div>

      {/* 📞 Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button className="p-3 text-gray-400 hover:text-[#0F82FF] hover:bg-[#0F82FF10] rounded-2xl transition-all"><Phone className="w-4 h-4" /></button>
        <button className="p-3 text-gray-400 hover:text-[#0F82FF] hover:bg-[#0F82FF10] rounded-2xl transition-all hidden sm:block"><Video className="w-4 h-4" /></button>
        <button className="p-3 text-gray-400 hover:text-[#0F82FF] hover:bg-[#0F82FF10] rounded-2xl transition-all"><MoreVertical className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

export default ChatHeader;

