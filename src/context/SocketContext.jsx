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

  useEffect(() => {
    // ✅ Initialize socket only once after user login
    if (user?._id && !socketRef.current) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: false,
        transports: ["websocket"], // Use websocket only
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 300, // ✅ Reduced delay for faster reconnection
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // ✅ Now connect
      newSocket.connect();

      // ✅ On connected
      newSocket.on("connect", () => {
        console.log("✅ Socket connected:", newSocket.id);
        setIsConnected(true);
      });

      // ✅ On disconnected
      newSocket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        setIsConnected(false);
      });

      // ✅ On receiving updated online users
      newSocket.on("updateOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [user?._id]);

  // ✅ When connected and user is known, emit "userOnline"
  useEffect(() => {
    if (socketRef.current && isConnected && user?._id) {
      console.log("📡 Emitting userOnline:", user._id);
      socketRef.current.emit("userOnline", user._id);
    }
  }, [isConnected, user?._id]);

  // ✅ Optional: reconnect on tab focus (Instagram does this)
  useEffect(() => {
    const reconnectOnFocus = () => {
      if (socketRef.current && !socketRef.current.connected) {
        socketRef.current.connect();
        console.log("🔁 Reconnecting on window focus...");
      }
    };

    window.addEventListener("focus", reconnectOnFocus);
    return () => window.removeEventListener("focus", reconnectOnFocus);
  }, []);

  // ✅ Manual disconnect (on logout)
  const disconnectSocket = () => {
    if (socketRef.current) {
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
        disconnectSocket,
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



















