import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constant';
import { useSocket } from '../context/SocketContext';
import useMyProfile from '../hooks/useMyProfile';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { targetUserId } = useParams();
  const { data: user } = useMyProfile();
  const { socket } = useSocket();
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch old messages
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
          };
        });

        setMessages(chatMessage);
      } catch (err) {
        console.error("❌ Failed to fetch chat:", err.message);
      }
    };

    fetchChatMessage();
  }, [targetUserId]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("joinChat", { targetUserId });

    const handleReceiveMessage = ({ firstName, lastName, text, userId }) => {
      setMessages((prev) => [...prev, { firstName, lastName, text, userId }]);
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
    });

    setNewMessage('');
  };

  return (
    <div className="w-2/4 border border-gray-400 m-4 h-auto flex justify-center mx-auto">
      <div className="w-full flex-1 overflow-auto p-5 chat-container max-h-[600px]">
        <h2 className="text-xl font-extrabold text-secondary mx-auto p-5 border-b border-gray-400 text-center">
          Chat
        </h2>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${user._id === msg.userId ? "chat-end" : "chat-start"} mb-4`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <div className="chat-header">
              {`${msg?.firstName} ${msg?.lastName}`}
              <time className="text-xs opacity-50 ml-2">now</time>
            </div>
            <div className="chat-bubble">{msg?.text}</div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
        ))}

        <div ref={messagesEndRef} />

        <div className="p-5 border-t border-gray-400 flex justify-between items-center">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            type="text"
            className="border-2 border-gray-300 rounded-md flex-1 p-2 mr-2"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;







































