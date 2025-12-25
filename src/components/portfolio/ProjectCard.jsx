import React, { useState } from "react";
import { Github, Globe, Trash2, ExternalLink } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api";
import toast from "react-hot-toast";

const ProjectCard = ({ project, isOwner }) => {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: deleteProject, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      await API.delete(`/project/${project._id}`, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success("Project removed");
      queryClient.invalidateQueries(["my-projects"]);
      queryClient.invalidateQueries(["user-projects"]);
    },
    onError: () => toast.error("Failed to delete project")
  });

  return (
    <div
      className="group relative bg-white dark:bg-[#1A1B1F] border border-gray-100 dark:border-[#2F2F3A] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#0F82FF]/30 transition-all duration-300 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🖼️ Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img
          src={project.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Links Overlay (Visible on Hover) */}
        <div className={`absolute inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all transform hover:scale-110"
              title="View Code"
            >
              <Github className="w-6 h-6" />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-[#0F82FF] hover:bg-[#0F82FF]/80 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all transform hover:scale-110"
              title="Live Demo"
            >
              <Globe className="w-6 h-6" />
            </a>
          )}
        </div>

        {/* Delete Button (Owner Only) */}
        {isOwner && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm('Delete project?')) deleteProject();
            }}
            className="absolute top-3 right-3 z-30 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-lg backdrop-blur-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 📝 Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 line-clamp-1" title={project.title}>
          {project.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
          {project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-[#2F2F3A]">
          {project.techStack.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-[#2F2F3A] text-gray-600 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider rounded-md">
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-1 text-gray-400 text-[10px] font-bold">
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
