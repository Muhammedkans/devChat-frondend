// src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import SOCKET_URL from "../api/socketUrl"; // ✅ Your backend socket server URL

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    console.time("Socket Connect Time");

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],           // ✅ Only WebSocket (fastest)
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 500,              // ✅ Fast retry
      reconnectionDelayMax: 2000,          // ✅ Limit max delay
      timeout: 5000,                       // ✅ Timeout after 5 seconds
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected to server");
      console.timeEnd("Socket Connect Time");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

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

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};












