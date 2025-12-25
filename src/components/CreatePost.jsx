import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api";
import { Image, Send, X, Smile, MapPin, Hash } from "lucide-react";
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
      toast.success("Moment shared with the world!");
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
      toast.error("Share some brilliance with the world.");
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
    <div className="space-y-4">
      <div className="flex gap-4 p-2 items-start">
        <img
          src={user?.photoUrl}
          alt="User"
          className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-[#2F2F3A] shadow-md"
        />
        <div className="flex-1 space-y-4">
          <textarea
            rows="3"
            placeholder="Build something incredible today?"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-base font-medium placeholder:text-gray-400 dark:text-gray-100 resize-none min-h-[80px]"
          />

          {preview && (
            <div className="relative group rounded-3xl overflow-hidden border border-gray-100 dark:border-[#2F2F3A] bg-gray-50 dark:bg-black/20">
              <img src={preview} alt="Preview" className="max-h-80 w-full object-cover" />
              <button
                onClick={removePhoto}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2F2F3A]">
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-xl hover:bg-[#0F82FF10] text-[#0F82FF] transition-all group"
                title="Add Image"
              >
                <Image className="w-5 h-5 group-hover:scale-110" />
              </button>
              <button className="p-3 rounded-xl hover:bg-yellow-500/10 text-yellow-500 transition-all group" title="Emojis">
                <Smile className="w-5 h-5 group-hover:scale-110" />
              </button>
              <button className="p-3 rounded-xl hover:bg-green-500/10 text-green-500 transition-all group hidden sm:block" title="Location">
                <MapPin className="w-5 h-5 group-hover:scale-110" />
              </button>
              <button className="p-3 rounded-xl hover:bg-purple-500/10 text-purple-500 transition-all group hidden sm:block" title="Hashtags">
                <Hash className="w-5 h-5 group-hover:scale-110" />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-[#0F82FF] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sharing
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Launch <Send className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;









