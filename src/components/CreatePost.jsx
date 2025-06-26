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
        // ✅ Do NOT set Content-Type manually!
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
      className="border p-4 rounded-lg shadow space-y-4 bg-white"
    >
      <h2 className="text-xl font-semibold">Create a Post</h2>

      <textarea
        rows="3"
        placeholder="What's on your mind?"
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="block"
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="max-h-64 w-full object-contain rounded border"
        />
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};

export default CreatePost;






