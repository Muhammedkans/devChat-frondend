import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constant';
import { useSocket } from '../context/SocketContext';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const socket = useSocket();

  const fetchChatMessage = async () => {
    const chat = await axios.get(API_URL + "/chat/" + targetUserId, { withCredentials: true });

    const chatMessage = chat?.data?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });

    setMessages(chatMessage);
  };

  useEffect(() => {
    fetchChatMessage();
  }, [targetUserId]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId: user._id,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [socket, user?._id, targetUserId]);

  // ✅ Fix: add message to state instantly
  const sendMessage = () => {
    if (!socket || !newMessage.trim()) return;

    const msg = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId: user?._id,
      targetUserId,
      text: newMessage,
    };

    socket.emit("sendMessage", msg);

    // ✅ Update local state immediately to show message without refresh
    setMessages((prev) => [...prev, { firstName: msg.firstName, lastName: msg.lastName, text: msg.text }]);

    setNewMessage("");
  };

  return (
    <div className="w-2/4 border border-gray-400 m-4 h-auto flex justify-center mx-auto">
      <div className="w-full flex-1 overflow-scroll p-5 chat-container">
        <h2 className="text-xl font-extrabold text-secondary mx-auto p-5 border-b border-gray-400 text-center">
          Chat
        </h2>

        {messages.map((msg, index) => (
          <div key={index} className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"} h-40`}>
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
              <time className="text-xs opacity-50">12:45</time>
            </div>
            <div className="chat-bubble">{msg?.text}</div>
            <div className="chat-footer opacity-50">Delivered</div>
          </div>
        ))}

        <div className="p-5 border-t border-gray-400 flex justify-between items-center">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            type="text"
            className="border-3 flex-1 p-2"
          />
          <button onClick={sendMessage} className="bg-secondary p-4">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;




