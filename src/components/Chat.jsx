import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constant';
import { useSocket } from '../context/SocketContext';
import useMyProfile from '../hooks/useMyProfile';
import ChatHeader from '../components/ChatHeader';

import { Mic, Send, StopCircle, Play, Pause, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Chat = () => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const { targetUserId } = useParams();
  const { data: user } = useMyProfile();
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ✅ Scroll to bottom
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
          audioUrl: msg.audioUrl,
          messageType: msg.messageType || 'text',
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

  // ✅ Socket Logic
  useEffect(() => {
    if (!socket || !isConnected || !user?._id || !targetUserId) return;

    socket.emit('joinChat', { targetUserId });

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('messageReceived', handleReceiveMessage);
    return () => socket.off('messageReceived', handleReceiveMessage);
  }, [socket, isConnected, user?._id, targetUserId]);

  // 🎤 Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
  };

  const sendAudioMessage = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-note.webm');

    try {
      toast.loading("Sending voice note...", { id: 'audio-upload' });
      const res = await axios.post(`${API_URL}/chat/upload-audio`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      socket.emit('sendMessage', {
        targetUserId,
        audioUrl: res.data.audioUrl,
        messageType: 'audio'
      });

      setAudioBlob(null);
      toast.success("Voice note sent", { id: 'audio-upload' });
    } catch (err) {
      toast.error("Failed to send voice note", { id: 'audio-upload' });
    }
  };

  // ✅ Send text message
  const sendMessage = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    socket.emit('sendMessage', {
      targetUserId,
      text: trimmed,
      messageType: 'text'
    });

    setNewMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-[90vh] max-w-4xl mx-auto flex flex-col bg-white dark:bg-[#10131A] border border-gray-100 dark:border-[#2F2F3A] rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 m-4">
      {/* 🔝 Chat Header */}
      <ChatHeader userId={targetUserId} />

      {/* 💬 Chat Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide dark:bg-[#0D0C1D]/50">
        {messages.map((msg, index) => {
          const isMyMessage = user?._id === msg.userId;
          const time = msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'now';

          return (
            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} items-end group`}>
              {!isMyMessage && (
                <img
                  src={msg.photoUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + msg.firstName}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-3 border-2 border-[#0F82FF] shadow-lg object-cover"
                />
              )}

              <div
                className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm transition-all duration-300 ${isMyMessage
                    ? 'bg-gradient-to-br from-[#0F82FF] to-[#0F82FFCC] text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-[#1A1B1F] text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-[#2F2F3A]'
                  }`}
              >
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
                  {isMyMessage ? 'You' : `${msg.firstName} ${msg.lastName}`}
                </p>

                {msg.messageType === 'audio' ? (
                  <div className="py-2">
                    <audio src={msg.audioUrl} controls className="h-8 max-w-[200px] sm:max-w-xs hue-rotate-180 invert dark:hue-rotate-0 dark:invert-0" />
                  </div>
                ) : (
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                )}

                <p className={`text-[9px] mt-1 text-right font-bold ${isMyMessage ? 'text-white/70' : 'text-gray-500'}`}>{time}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 📝 Input Section */}
      <div className="p-4 sm:p-6 bg-white dark:bg-[#10131A] border-t border-gray-100 dark:border-[#2F2F3A] transition-all">
        {audioBlob ? (
          <div className="flex items-center justify-between bg-[#0F82FF10] p-4 rounded-3xl animate-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-[#0F82FF]">Voice Note Ready</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setAudioBlob(null)}
                className="p-3 hover:bg-red-500/10 text-red-500 rounded-2xl transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={sendAudioMessage}
                className="px-6 py-3 bg-[#0F82FF] text-white rounded-2xl font-bold flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRecording}
              type="text"
              placeholder={isRecording ? "Recording..." : "Message your dev friend..."}
              className="flex-1 bg-gray-50 dark:bg-[#1A1B1F] border border-gray-200 dark:border-[#2F2F3A] rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F82FF] dark:text-white transition-all shadow-inner"
            />

            {isRecording ? (
              <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20">
                <span className="text-red-500 font-black text-xs animate-pulse">{formatTime(recordingTime)}</span>
                <button
                  onClick={stopRecording}
                  className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-500/20 active:scale-95"
                >
                  <StopCircle className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={startRecording}
                  className="p-4 bg-gray-100 dark:bg-[#1A1B1F] text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-[#0F82FF10] hover:text-[#0F82FF] transition active:scale-90"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  className="p-4 bg-[#0F82FF] text-white rounded-2xl hover:shadow-[0_0_20px_rgba(15,130,255,0.4)] transition active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;




























































