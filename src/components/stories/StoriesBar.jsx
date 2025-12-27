import React, { useState, useEffect } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api";
import toast from "react-hot-toast";

const StoriesBar = () => {
  const queryClient = useQueryClient();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [storyUrl, setStoryUrl] = useState("");

  // 📡 Fetch Stories
  const { data: storyGroups = [], isLoading } = useQuery({
    queryKey: ["stories-feed"],
    queryFn: async () => {
      const res = await API.get("/story/feed", { withCredentials: true });
      return res.data.data;
    }
  });

  // 📤 Add Story Mutation
  const { mutate: addStory, isLoading: isUploading } = useMutation({
    mutationFn: async (url) => {
      await API.post("/story/add", { mediaUrl: url, type: 'image' }, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success("Story added!");
      queryClient.invalidateQueries(["stories-feed"]);
      setIsUploadModalOpen(false);
      setStoryUrl("");
    }
  });

  // Auto-advance slides logic (Simple implementation)
  useEffect(() => {
    if (selectedStoryIndex !== null) {
      const timer = setTimeout(() => {
        const currentGroup = storyGroups[selectedStoryIndex];
        if (currentSlideIndex < currentGroup.stories.length - 1) {
          setCurrentSlideIndex(prev => prev + 1);
        } else {
          // Close or Next User
          if (selectedStoryIndex < storyGroups.length - 1) {
            setSelectedStoryIndex(prev => prev + 1);
            setCurrentSlideIndex(0);
          } else {
            setSelectedStoryIndex(null); // Close
            setCurrentSlideIndex(0);
          }
        }
      }, 3000); // 3 seconds per story
      return () => clearTimeout(timer);
    }
  }, [selectedStoryIndex, currentSlideIndex, storyGroups]);

  const handleOpenStory = (index) => {
    setSelectedStoryIndex(index);
    setCurrentSlideIndex(0);
  };

  if (isLoading) return <div className="h-24 w-full bg-gray-100 dark:bg-[#1A1B1F] animate-pulse rounded-2xl mb-8"></div>;

  return (
    <div className="mb-10 w-full overflow-x-auto custom-scrollbar pb-2">
      <div className="flex items-center gap-4 px-2">

        {/* ➕ Add Story Button */}
        <div onClick={() => setIsUploadModalOpen(true)} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[70px]">
          <div className="w-[70px] h-[70px] rounded-full border-2 border-dashed border-[#0F82FF] flex items-center justify-center bg-[#0F82FF05] group-hover:bg-[#0F82FF10] transition-colors relative">
            <Plus className="w-6 h-6 text-[#0F82FF]" />
            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-0 group-hover:opacity-20 bg-[#0F82FF]"></div>
          </div>
          <p className="text-[10px] font-bold text-gray-500">Add Story</p>
        </div>

        {/* 🎞️ Story Circles */}
        {storyGroups.map((group, index) => (
          <div key={group.user._id} onClick={() => handleOpenStory(index)} className="flex flex-col items-center gap-2 cursor-pointer min-w-[70px]">
            <div className="p-[3px] rounded-full bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] hover:scale-105 transition-transform">
              <div className="p-[2px] bg-white dark:bg-[#050505] rounded-full">
                <img
                  src={group.user.photoUrl}
                  alt={group.user.firstName}
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate max-w-[70px]">{group.user.firstName}</p>
          </div>
        ))}
      </div>

      {/* 🎥 Full Screen Viewer Modal */}
      {selectedStoryIndex !== null && storyGroups[selectedStoryIndex] && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button onClick={() => setSelectedStoryIndex(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white z-50">
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
              {storyGroups[selectedStoryIndex].stories.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-300 ease-linear ${idx < currentSlideIndex ? 'w-full' :
                        idx === currentSlideIndex ? 'w-full animate-progress' : 'w-0'
                      }`}
                    style={{ transitionDuration: idx === currentSlideIndex ? '3000ms' : '0ms' }}
                  ></div>
                </div>
              ))}
            </div>

            {/* User Info */}
            <div className="absolute top-8 left-4 flex items-center gap-3 z-20">
              <img src={storyGroups[selectedStoryIndex].user.photoUrl} className="w-10 h-10 rounded-full border-2 border-white/20" />
              <p className="font-bold text-white text-sm drop-shadow-md">{storyGroups[selectedStoryIndex].user.firstName}</p>
            </div>

            {/* Content */}
            <img
              src={storyGroups[selectedStoryIndex].stories[currentSlideIndex].mediaUrl}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>

            {/* Navigation */}
            <div className="absolute inset-y-0 left-0 w-1/3 z-10" onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}></div>
            <div className="absolute inset-y-0 right-0 w-1/3 z-10" onClick={() => {
              if (currentSlideIndex < storyGroups[selectedStoryIndex].stories.length - 1) setCurrentSlideIndex(currentSlideIndex + 1);
              else setSelectedStoryIndex(null);
            }}></div>
          </div>
        </div>
      )}

      {/* 📤 Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#10131A] p-8 rounded-3xl max-w-md w-full border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4">Add to Story</h3>
            <input
              type="text"
              placeholder="Paste Image URL here..."
              className="w-full bg-[#1A1B1F] border border-gray-700 rounded-xl px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-[#0F82FF]"
              value={storyUrl}
              onChange={(e) => setStoryUrl(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsUploadModalOpen(false)} className="px-4 py-2 text-gray-400 font-bold">Cancel</button>
              <button onClick={() => addStory(storyUrl)} disabled={isUploading || !storyUrl} className="px-6 py-2 bg-[#0F82FF] text-white rounded-xl font-bold">
                {isUploading ? "Posting..." : "Share"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesBar;
