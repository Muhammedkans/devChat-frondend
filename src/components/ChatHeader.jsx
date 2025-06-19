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

  if (isLoading || !user) return <div className="p-4">Loading...</div>;

  return (
    <div className="flex items-center gap-3 p-4 border-b shadow-sm bg-white">
      <div className="relative">
        <img
          src={user.photoUrl}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline && (
          <FaCircle className="absolute bottom-0 right-0 text-green-500 bg-white rounded-full p-0.5 text-xs" />
        )}
      </div>
      <div>
        <h2 className="text-md font-semibold">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">{isOnline ? "Online" : "Offline"}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
