import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api";
import { Image, Send, X, Smile, MapPin, Hash, Globe, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import useMyProfile from "../hooks/useMyProfile";

const CreatePost = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const { data: user } = useMyProfile();

  const [contentText, setContentText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { mutate: createPost } = useMutation({
    mutationFn: async (formData) => {
      const res = await API.post("/posts", formData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      setContentText("");
      setPhoto(null);
      setPreview(null);
      queryClient.invalidateQueries(["posts"]);
      toast.success("Broadcast sent successfully!");
    },
    onError: (err) => {
      console.error("❌ Post error:", err);
      toast.error(err.response?.data?.message || err.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contentText.trim() && !photo) {
      toast.error("Input required for transmission.");
      return;
    }

    const formData = new FormData();
    formData.append("contentText", contentText.trim());
    if (photo) {
      formData.append("photo", photo);
    }

    setLoading(true);
    createPost(formData);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
      <div className="flex gap-4">
        {/* 👤 User Avatar */}
        <div className="flex-shrink-0">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            <img
              src={user?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`}
              alt="User"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-[#2F2F3A] shadow-xl relative z-10"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* 📝 Input Area */}
          <div className="relative">
            <textarea
              rows={isFocused || contentText ? 4 : 2}
              placeholder="What's on your mind?"
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !contentText && !photo && setIsFocused(false)}
              className="w-full bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400 font-medium resize-none transition-all duration-300 py-2 scrollbar-hide"
            />

            {/* 🖼️ Image Preview */}
            {preview && (
              <div className="relative mt-4 mb-2 group rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img src={preview} alt="Preview" className="w-full max-h-[400px] object-cover" />
                <button
                  onClick={removePhoto}
                  className="absolute top-4 right-4 p-2 bg-black/40 text-white rounded-full backdrop-blur-md hover:bg-red-500 transition-all z-20 opacity-0 group-hover:opacity-100 transform group-hover:scale-100 scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* 🛠️ Action Bar */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100 dark:border-[#2F2F3A]/50">
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                ref={fileInputRef}
              />
              {[
                { icon: Image, title: "Media", action: () => fileInputRef.current?.click(), color: "text-[#0F82FF]" },
                { icon: Smile, title: "Feeling", color: "text-yellow-500" },
                { icon: MapPin, title: "Location", color: "text-red-500" },
                { icon: Calendar, title: "Schedule", color: "text-purple-500" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1B1F] transition-all group relative`}
                  title={item.title}
                >
                  <item.icon className={`w-5 h-5 ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform`} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {contentText.length > 0 && (
                <div className="hidden sm:block">
                  <div className="h-6 w-[1px] bg-gray-200 dark:bg-[#2F2F3A]"></div>
                </div>
              )}
              {contentText.length > 0 && (
                <span className={`text-[10px] font-black ${contentText.length > 280 ? 'text-red-500' : 'text-gray-400'}`}>
                  {contentText.length}/280
                </span>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || (!contentText.trim() && !photo)}
                className="group relative px-6 py-2.5 bg-[#0F82FF] hover:bg-[#0A66C2] text-white rounded-full font-bold text-sm shadow-[0_4px_14px_0_rgba(15,130,255,0.39)] hover:shadow-[0_6px_20px_rgba(15,130,255,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 active:scale-95 overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-2">
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <span>Post</span>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;









