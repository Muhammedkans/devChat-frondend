// context/SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SOCKET_URL from "../api/socketUrl";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = io(SOCKET_URL, {
      withCredentials: true,
    });

    socket.current.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Socket connected");
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};


