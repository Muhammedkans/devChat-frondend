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

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Fetch old messages
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

    const messagePayload = {
      targetUserId,
      text: trimmed,
    };

    socket.emit('sendMessage', messagePayload);
    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="h-screen flex flex-col max-w-xl mx-auto shadow-xl border border-gray-300 rounded-lg bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <ChatHeader userId={targetUserId} />

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, index) => {
          const isMyMessage = user._id === msg.userId;
          return (
            <div
              key={index}
              className={`flex items-end ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}
            >
              {/* 👤 Receiver profile */}
              {!isMyMessage && (
                <img
                  src={msg.photoUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                  alt="Receiver"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}

              {/* 💬 Chat bubble */}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-md ${
                  isMyMessage
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 rounded-bl-none'
                }`}
              >
                <div className="font-semibold">
                  {msg.firstName} {msg.lastName}
                </div>
                <div>{msg.text}</div>
                <div className="text-[10px] text-right mt-1 opacity-60">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString()
                    : 'now'}
                </div>
              </div>

              {/* 👤 Sender profile */}
              {isMyMessage && (
                <img
                  src={msg.photoUrl || 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'}
                  alt="Me"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ✏️ Message input */}
      <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white flex items-center gap-2">
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-purple-300"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-md hover:opacity-90"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;



























































