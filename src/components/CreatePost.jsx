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
      className="bg-gradient-to-tr from-pink-50 via-purple-50 to-blue-50 border border-purple-200 p-6 rounded-2xl shadow-lg space-y-4 transition-all duration-300"
    >
      <h2 className="text-lg font-bold text-purple-700">Create a Post</h2>

      <textarea
        rows="3"
        placeholder="What's on your mind?"
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
        className="w-full p-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none bg-white shadow-sm"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="block text-sm text-gray-600"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-64 w-full object-contain rounded-lg border mt-2"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold disabled:opacity-50 transition-all"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;








