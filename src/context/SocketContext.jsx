// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import SOCKET_URL from "../api/socketUrl"; // ✅ Make sure this URL is correct!

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // ✅ Create a socket instance
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"], // force WebSocket for stability
      reconnection: true, // auto reconnect if connection breaks
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // ✅ Handle connection
    newSocket.on("connect", () => {
      console.log("✅ Socket connected to server");
      setIsConnected(true);
    });

    // ✅ Handle disconnection
    newSocket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    // ✅ Track online users
    newSocket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // ✅ Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Custom hook for easy usage
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};











