// src/context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SOCKET_URL from "../api/socketUrl";
import useMyProfile from "../hooks/useMyProfile";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const { data: user } = useMyProfile();

  const socketRef = useRef(null); // ✅ to persist socket instance

  // ✅ Connect socket only after login (when user available)
  useEffect(() => {
    if (user?._id && !socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: false, // ❗️ important
        transports: ["websocket"],
        reconnection: true,
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.connect(); // ✅ manually connect after login

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

  // ✅ Re-emit userOnline after connect
  useEffect(() => {
    if (socketRef.current && isConnected && user?._id) {
      socketRef.current.emit("userOnline", user._id);
    }
  }, [isConnected, user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider> 
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

















