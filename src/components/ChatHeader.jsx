import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../context/SocketContext";
import { FaCircle } from "react-icons/fa";
import API from "../api";

const ChatHeader = ({ userId }) => {
  const { onlineUsers } = useSocket();

  const { data: user, isLoading } = useQuery({
    queryKey: ["chatUser", userId],
    queryFn: async () => {
      const { data } = await API.get(`/users/${userId}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!userId,
  });

  const isOnline = onlineUsers.includes(userId);

  if (isLoading || !user) {
    return (
      <div className="p-4 border-b bg-white shadow-sm text-sm text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 border-b shadow-sm bg-white sticky top-0 z-10">
      {/* 👤 Profile Image */}
      <div className="relative">
        <img
          src={
            user.photoUrl ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`
          }
          alt="User"
          className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300"
        />
        {isOnline && (
          <FaCircle className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full text-xs p-0.5 shadow" />
        )}
      </div>

      {/* 👤 Name + Status */}
      <div>
        <h2 className="text-md font-bold text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
        <p
          className={`text-xs font-medium ${
            isOnline ? "text-green-500" : "text-gray-400"
          }`}
        >
          {isOnline ? "Online now" : "Offline"}
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;

