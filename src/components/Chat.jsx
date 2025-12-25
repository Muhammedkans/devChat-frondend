import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/constant';
import { useSocket } from '../context/SocketContext';
import useMyProfile from '../hooks/useMyProfile';
import ChatHeader from '../components/ChatHeader';

import {
  Mic,
  Send,
  StopCircle,
  Trash2,
  Paperclip,
  Smile,
  Volume2,
  MessageSquare,
  Lock
} from 'lucide-react';
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
  const navigate = useNavigate();
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

        const chatMessages = (res?.data?.messages || []).map((msg) => ({
          firstName: msg.senderId?.firstName || "Unknown",
          lastName: msg.senderId?.lastName || "",
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
        toast.error("Could not load messages");
      }
    };

    if (targetUserId) fetchMessages();
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
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
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
      toast.error("Microphone access denied. Please check permission.");
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
      toast.loading("Sending voice...", { id: 'audio-upload' });
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
      toast.success("Voice memo sent", { id: 'audio-upload' });
    } catch (err) {
      console.error(err);
      toast.error("Failed to send voice memo", { id: 'audio-upload' });
    }
  };

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
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white/70 dark:bg-[#10131A]/80 backdrop-blur-3xl border border-white/20 dark:border-[#2F2F3A] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-700 m-2 sm:m-4 md:m-6">

      {/* 🔝 Chat Header */}
      <ChatHeader userId={targetUserId} />

      {/* 💬 Chat Body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 scrollbar-hide dark:bg-[#0D0C1D]/30">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-40 select-none">
            <div className="w-20 h-20 bg-[#0F82FF20] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-[#0F82FF]" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">End-to-End Encrypted</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMyMessage = user?._id === msg.userId;
            const time = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'now';

            return (
              <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} items-end gap-3 animate-in slide-in-from-bottom-2 duration-500`}>
                {!isMyMessage && (
                  <img
                    src={msg.photoUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + msg.firstName}
                    alt="User"
                    className="w-8 h-8 rounded-xl border border-[#0F82FF50] shadow-lg object-cover"
                  />
                )}

                <div
                  className={`relative group max-w-[85%] sm:max-w-[70%] px-5 py-3.5 rounded-[1.5rem] transition-all duration-300 ${isMyMessage
                    ? 'bg-[#0F82FF] text-white rounded-br-none shadow-[0_10px_20px_rgba(15,130,255,0.2)]'
                    : 'bg-white dark:bg-[#1A1B1F] text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-[#2F2F3A] shadow-lg'
                    }`}
                >
                  {msg.messageType === 'audio' ? (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isMyMessage ? 'bg-white/20' : 'bg-[#0F82FF10] text-[#0F82FF]'}`}>
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Voice Memo</p>
                      </div>
                      <audio
                        src={msg.audioUrl}
                        controls
                        className={`h-8 w-full ${isMyMessage ? 'hue-rotate-180 invert brightness-200' : 'dark:hue-rotate-0 dark:invert-0'}`}
                      />
                    </div>
                  ) : (
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                  )}

                  <div className={`flex items-center gap-2 mt-2 justify-end opacity-0 group-hover:opacity-60 transition-opacity duration-300`}>
                    <p className={`text-[8px] font-black uppercase tracking-widest`}>{time}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 📝 Input Section */}
      <div className="p-4 sm:p-6 bg-white/50 dark:bg-[#10131A]/50 border-t border-gray-100 dark:border-[#2F2F3A] backdrop-blur-3xl">
        {audioBlob ? (
          <div className="flex items-center justify-between bg-[#0F82FF10] p-4 rounded-[1.5rem] border border-[#0F82FF20] animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#0F82FF] rounded-full flex items-center justify-center animate-pulse">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-[#0F82FF] uppercase tracking-[0.2em]">Ready to Send</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase">Audio Clip Detected</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAudioBlob(null)}
                className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={sendAudioMessage}
                className="px-8 py-3 bg-[#0F82FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                Send <Send className="w-4 h-4 inline ml-2" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 sm:gap-4 max-w-5xl mx-auto">
            <div className="hidden sm:flex items-center gap-1">
              <button className="p-3 text-gray-400 hover:text-[#0F82FF] hover:bg-[#0F82FF10] rounded-2xl transition-all">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-2xl transition-all">
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 group">
              <input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isRecording}
                type="text"
                placeholder={isRecording ? "Listening..." : "Type your message..."}
                className="w-full bg-gray-100/50 dark:bg-[#1A1B1F]/50 border border-gray-200 dark:border-[#2F2F3A] rounded-[1.5rem] px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 ring-[#0F82FF50] dark:text-white transition-all shadow-inner"
              />
              <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-2">
                {isRecording && (
                  <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="p-4 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/20 active:scale-90 animate-pulse"
              >
                <StopCircle className="w-6 h-6" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={startRecording}
                  className="p-4 bg-gray-100 dark:bg-[#1A1B1F] text-[#0F82FF] rounded-2xl hover:bg-[#0F82FF] hover:text-white transition-all duration-300 active:scale-90 shadow-sm"
                >
                  <Mic className="w-6 h-6" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-4 bg-[#0F82FF] text-white rounded-2xl shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-widest disabled:opacity-30 disabled:grayscale"
                >
                  <Send className="w-6 h-6" />
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
