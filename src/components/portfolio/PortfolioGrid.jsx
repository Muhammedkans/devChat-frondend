import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, FolderOpen } from "lucide-react";
import ProjectCard from "./ProjectCard";
import AddProjectModal from "./AddProjectModal";
import API from "../../api";

const PortfolioGrid = ({ userId, isOwner }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: isOwner ? ["my-projects"] : ["user-projects", userId],
    queryFn: async () => {
      const res = await API.get(`/project/user/${userId}`);
      return res.data.data;
    },
    enabled: !!userId, // Fetch only if userId is available
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-100 dark:bg-[#1A1B1F] rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-[#0F82FF]" />
          Project Showcase
        </h2>

        {isOwner && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F82FF] hover:bg-[#0F82FF]/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-[#1A1B1F]/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-[#2F2F3A]">
          <div className="w-16 h-16 bg-gray-200 dark:bg-[#2F2F3A] rounded-full mx-auto flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Projects Yet</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">
            {isOwner
              ? "Show off your skills! Add your first project to your portfolio."
              : "This developer hasn't showcased any projects yet."}
          </p>
          {isOwner && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[#0F82FF] font-bold hover:underline"
            >
              + Create Portfolio Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} isOwner={isOwner} />
          ))}
        </div>
      )}

      {/* Modal */}
      {isOwner && (
        <AddProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default PortfolioGrid;
