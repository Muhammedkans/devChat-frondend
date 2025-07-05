import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api"; // Axios instance

const CreatePost = () => {
  const queryClient = useQueryClient();
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
      alert("✅ Post created successfully");
    },
    onError: (err) => {
      console.error("❌ Post error:", err);
      alert("❌ Error: " + (err.response?.data?.message || err.message));
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contentText && !photo) {
      alert("⚠️ Please enter some text or choose an image.");
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

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="rounded-2xl p-6 bg-[#1A1B1F] bg-opacity-80 backdrop-blur-lg shadow-[0_0_20px_#0F82FF22] border border-[#2F2F3A] space-y-4 text-white"
    >
      <h2 className="text-lg font-bold text-[#0F82FF]">Create a Post</h2>

      <textarea
        rows="3"
        placeholder="What's on your mind?"
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
        className="w-full p-3 bg-[#1F1F28] border border-[#333] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F82FF] resize-none placeholder:text-gray-400 text-white"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="block text-sm text-gray-400 file:bg-[#0F82FF] file:text-white file:rounded-lg file:px-3 file:py-1 file:cursor-pointer"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-64 w-full object-contain rounded-lg border border-[#333] shadow-md mt-2"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] hover:brightness-110 px-5 py-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-60"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;









