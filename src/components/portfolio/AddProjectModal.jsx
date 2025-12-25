import React, { useState } from "react";
import { X, Github, Globe, Code, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api";

const AddProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveLink: "",
    imageUrl: ""
  });

  const queryClient = useQueryClient();

  const { mutate: addProject, isLoading } = useMutation({
    mutationFn: async (newProject) => {
      const res = await API.post("/project/add", newProject, { withCredentials: true });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project added to your portfolio!");
      queryClient.invalidateQueries(["my-projects"]);
      setFormData({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveLink: "",
        imageUrl: ""
      });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add project");
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error("Title and Description are required");
      return;
    }
    addProject(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#10131A] border border-[#2F2F3A] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#2F2F3A] flex justify-between items-center bg-gradient-to-r from-[#10131A] to-[#151720]">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Add Project</h2>
            <p className="text-gray-400 text-sm">Showcase your best work to the world</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Project Title</label>
              <input
                type="text"
                placeholder="e.g. AI Content Generator"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#1A1B1F] border border-[#2F2F3A] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0F82FF] focus:ring-1 focus:ring-[#0F82FF] transition-all"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wide">Description</label>
              <textarea
                placeholder="What does this project do? What problems does it solve?"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-[#1A1B1F] border border-[#2F2F3A] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0F82FF] focus:ring-1 focus:ring-[#0F82FF] transition-all resize-none"
              />
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <Code className="w-4 h-4 text-[#0F82FF]" /> Tech Stack
              </label>
              <input
                type="text"
                placeholder="React, Node.js, MongoDB (comma separated)"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                className="w-full bg-[#1A1B1F] border border-[#2F2F3A] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0F82FF] focus:ring-1 focus:ring-[#0F82FF] transition-all"
              />
            </div>

            {/* Links Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Repo
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                  className="w-full bg-[#1A1B1F] border border-[#2F2F3A] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0F82FF] focus:ring-1 focus:ring-[#0F82FF] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  <Globe className="w-4 h-4 text-green-400" /> Live Demo
                </label>
                <input
                  type="url"
                  placeholder="https://my-app.com"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  className="w-full bg-[#1A1B1F] border border-[#2F2F3A] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0F82FF] focus:ring-1 focus:ring-[#0F82FF] transition-all"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-300 uppercase tracking-wide flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-400" /> Cover Image URL
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-[#1A1B1F] border border-[#2F2F3A] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#0F82FF] focus:ring-1 focus:ring-[#0F82FF] transition-all"
              />
              <p className="text-xs text-gray-500">Leave empty for a random tech cover.</p>
            </div>

            {/* Actions */}
            <div className="pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-[#0F82FF] hover:bg-[#0F82FF]/90 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Project"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
