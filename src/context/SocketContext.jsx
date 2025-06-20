import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import SOCKET_URL from "../api/socketUrl"; // ✅ Your backend socket URL
import useMyProfile from "../hooks/useMyProfile"; // ✅ Fetch logged-in user info

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { data: user } = useMyProfile(); // ✅ Logged-in user

  // ✅ Connect socket when component mounts
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      timeout: 5000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users); // 📡 Store online users
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // ✅ Emit "userOnline" only when socket is connected and user is available
  useEffect(() => {
    if (socket && isConnected && user?._id) {
      console.log("📡 Emitting userOnline:", user._id);
      socket.emit("userOnline", user._id);
    }
  }, [socket, isConnected, user?._id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Custom hook to use socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};














