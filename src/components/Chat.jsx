import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constant';
import { useSocket } from '../context/SocketContext';
import useMyProfile from '../hooks/useMyProfile';
import ChatHeader from '../components/ChatHeader';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { targetUserId } = useParams();
  const { data: user } = useMyProfile();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat messages
  useEffect(() => {
    const fetchChatMessage = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        const chatMessage = res?.data?.messages.map((msg) => {
          const { senderId, text } = msg;
          return {
            firstName: senderId?.firstName,
            lastName: senderId?.lastName,
            text,
            userId: senderId?._id,
            photoUrl: senderId?.photoUrl, // ✅ add photoUrl here
          };
        });

        setMessages(chatMessage);
      } catch (err) {
        console.error("❌ Failed to fetch chat:", err.message);
      }
    };

    fetchChatMessage();
  }, [targetUserId]);

  // Real-time message receiving
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("joinChat", { targetUserId });

    const handleReceiveMessage = ({ firstName, lastName, text, userId, photoUrl }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text, userId, photoUrl }]);
    };

    socket.on("messageReceived", handleReceiveMessage);

    return () => {
      socket.off("messageReceived", handleReceiveMessage);
    };
  }, [socket, user?._id, targetUserId]);

  // Send message
  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    socket.emit("sendMessage", {
      targetUserId,
      text: newMessage.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl, // ✅ include sender photoUrl while sending
    });

    setNewMessage('');
  };

  return (
    <div className="w-full max-w-xl mx-auto border border-gray-300 rounded-lg shadow-md overflow-hidden bg-white">
      <ChatHeader userId={targetUserId} />

      <div className="flex flex-col h-[600px] overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${user._id === msg.userId ? "chat-end" : "chat-start"} mb-4`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src={msg.photoUrl || "/default-avatar.png"} // ✅ use msg.photoUrl
                />
              </div>
            </div>
            <div className="chat-header font-medium text-sm">
              {msg.firstName} {msg.lastName}
              <time className="text-xs opacity-50 ml-2">now</time>
            </div>
            <div className="chat-bubble">{msg.text}</div>
            <div className="chat-footer opacity-50 text-xs">Delivered</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-300 flex items-center gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          className="flex-1 border border-gray-300 rounded-md p-2"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;









































