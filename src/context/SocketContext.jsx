import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SOCKET_URL from "../api/socketUrl";
import useMyProfile from "../hooks/useMyProfile";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const { data: user } = useMyProfile();

  const socketRef = useRef(null);

  // ✅ Connect socket after login only
  useEffect(() => {
    if (user?._id && !socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: false,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 500,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.connect();

      newSocket.on("connect", () => {
        console.log("✅ Socket connected after login");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setIsConnected(false);
      });

      newSocket.on("updateOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user?._id]);

  // ✅ Re-emit online status after connect
  useEffect(() => {
    if (socketRef.current && isConnected && user?._id) {
      console.log("📡 Emitting userOnline:", user._id);
      socketRef.current.emit("userOnline", user._id);
    }
  }, [isConnected, user?._id]);

  // ✅ Manual disconnect function (use on logout)
  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log("❌ Disconnecting socket manually (e.g., logout)");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onlineUsers,
        disconnectSocket, // ✅ Export this to use in logout
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Custom hook
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};


















