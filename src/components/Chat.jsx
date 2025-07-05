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
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Fetch chat history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        const chatMessages = res?.data?.messages.map((msg) => ({
          firstName: msg.senderId?.firstName,
          lastName: msg.senderId?.lastName,
          text: msg.text,
          userId: msg.senderId?._id,
          photoUrl: msg.senderId?.photoUrl,
          createdAt: msg.createdAt,
        }));

        setMessages(chatMessages);
      } catch (err) {
        console.error('❌ Failed to fetch chat:', err.message);
      }
    };

    fetchMessages();
  }, [targetUserId]);

  // ✅ Join room & listen for messages
  useEffect(() => {
    if (!socket || !isConnected || !user?._id || !targetUserId) return;

    socket.emit('joinChat', { targetUserId });

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('messageReceived', handleReceiveMessage);

    return () => {
      socket.off('messageReceived', handleReceiveMessage);
    };
  }, [socket, isConnected, user?._id, targetUserId]);

  // ✅ Send message
  const sendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    socket.emit('sendMessage', {
      targetUserId,
      text: trimmed,
    });

    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="h-screen max-w-3xl mx-auto flex flex-col bg-gradient-to-br from-pink-50 via-purple-100 to-indigo-100 border border-gray-300 rounded-xl shadow-lg overflow-hidden">
      {/* 🔝 Chat Header */}
      <ChatHeader userId={targetUserId} />

      {/* 💬 Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-purple-300">
        {messages.map((msg, index) => {
          const isMyMessage = user?._id === msg.userId;
          const time = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'now';

          return (
            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} items-end`}>
              {!isMyMessage && (
                <img
                  src={msg.photoUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + msg.firstName}
                  alt="User"
                  className="w-8 h-8 rounded-full mr-2 border border-purple-300"
                />
              )}

              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-md ${
                  isMyMessage
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="font-semibold">{msg.firstName} {msg.lastName}</p>
                <p>{msg.text}</p>
                <p className="text-[10px] mt-1 text-right opacity-60">{time}</p>
              </div>

              {isMyMessage && (
                <img
                  src={msg.photoUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + msg.firstName}
                  alt="Me"
                  className="w-8 h-8 rounded-full ml-2 border border-purple-300"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 📝 Message Input */}
      <div className="sticky bottom-0 p-3 border-t border-gray-200 bg-white flex items-center gap-2">
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;




























































