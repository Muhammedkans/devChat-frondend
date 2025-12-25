import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, MessageCircle, Heart, UserPlus, CheckCircle2 } from "lucide-react";
import API from "../api";
import { useSocket } from "../context/SocketContext";
import moment from "moment";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { socket } = useSocket();

  // 🔔 Fetch Notifications
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await API.get("/notifications", { withCredentials: true });
      return res.data.data;
    },
    // Refetch every 30 seconds for passive updates
    refetchInterval: 30000,
  });

  // Unique unread calculation
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 👂 Real-time Listener
  useEffect(() => {
    if (!socket) return;

    // Listen for generic Notification event if backend emits it
    // Currently backend emits "newComment", "requestReceived", etc.
    // Ideally we should make backend emit "notification" for all types.
    // For now, let's just invalidate queries on known events.
    const handleUpdate = () => {
      queryClient.invalidateQueries(["notifications"]);
    };

    socket.on("newComment", handleUpdate);
    socket.on("newLike", handleUpdate); // Assuming this event exists or we add it
    socket.on("connectionRequest", handleUpdate);
    socket.on("connectionAccepted", handleUpdate);

    return () => {
      socket.off("newComment", handleUpdate);
      socket.off("newLike", handleUpdate);
      socket.off("connectionRequest", handleUpdate);
      socket.off("connectionAccepted", handleUpdate);
    };
  }, [socket, queryClient]);

  // Handle Mark As Read logic if backend supports it (optional enhancement)
  // For now, clicking notification just navigates

  // 🖱️ Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-3 h-3 fill-white text-white" />;
      case 'comment': return <MessageCircle className="w-3 h-3 fill-white text-white" />;
      case 'connectionRequest': return <UserPlus className="w-3 h-3 text-white" />;
      case 'connectionAccepted': return <CheckCircle2 className="w-3 h-3 text-white" />;
      default: return <Bell className="w-3 h-3 text-white" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'like': return 'bg-red-500';
      case 'comment': return 'bg-blue-500';
      case 'connectionRequest': return 'bg-purple-500';
      case 'connectionAccepted': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMessage = (n) => {
    switch (n.type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'connectionRequest': return 'wants to connect';
      case 'connectionAccepted': return 'accepted your connection';
      default: return 'sent a notification';
    }
  };

  const handleNotificationClick = (n) => {
    // Navigate based on type
    setIsOpen(false);
    if (n.post) {
      // Since we don't have a single post page yet, scrolling to feed or similar
      // Ideally: navigate(`/post/${n.post._id}`)
      // For now, let's just go to profile or keep simple
    }
    if (n.type === 'connectionRequest') navigate('/requests');
    if (n.type === 'connectionAccepted') navigate(`/users/${n.sender._id}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl border transition-all duration-300 group active:scale-95 ${isOpen
            ? "bg-[#0F82FF10] border-[#0F82FF] text-[#0F82FF]"
            : "bg-gray-100 dark:bg-[#1A1B1F] border-gray-200 dark:border-[#2F2F3A] hover:bg-[#0F82FF15] text-[#0F82FF]"
          }`}
      >
        <Bell className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-[#10131A]"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white/95 dark:bg-[#13141F]/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-gray-100 dark:border-[#2F2F3A] z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-[#2F2F3A] flex justify-between items-center bg-gray-50/50 dark:bg-[#1A1B1F]/50">
            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Notifications</h3>
            {unreadCount > 0 && <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
          </div>

          {/* List */}
          <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#1A1B1F] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-bold text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`px-6 py-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-[#1A1B1F] cursor-pointer transition-colors border-b border-gray-50 dark:border-[#2F2F3A] last:border-0 ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={n.sender?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${n.sender?.firstName}`}
                      alt="Sender"
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-[#2F2F3A]"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white dark:border-[#13141F] ${getColor(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">
                      <span className="font-bold">{n.sender?.firstName}</span> {getMessage(n)}
                    </p>
                    <p className="text-[10px] bg-transparent text-gray-400 font-bold mt-1 uppercase tracking-wide">
                      {moment(n.createdAt).fromNow()}
                    </p>
                  </div>

                  {/* Unread Dot */}
                  {!n.isRead && (
                    <div className="w-2 h-2 bg-[#0F82FF] rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-100 dark:border-[#2F2F3A] bg-gray-50/50 dark:bg-[#1A1B1F]/50 text-center">
            <button className="text-xs font-bold text-[#0F82FF] hover:underline py-2">
              View All Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
