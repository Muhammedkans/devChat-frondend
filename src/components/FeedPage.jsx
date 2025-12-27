import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedPosts from './FeedPosts';
import DeveloperSuggestions from './DeveloperSuggestions';
import FeedSidebar from './FeedSidebar';
import useMyProfile from '../hooks/useMyProfile';
import { useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import StoriesBar from './stories/StoriesBar';

const FeedPage = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const { data, error, isLoading } = useMyProfile();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate('/login', { replace: true });
    }
  }, [error, navigate]);

  if (!user || isLoading || error?.response?.status === 401) return null;

  return (
    <div className="min-h-screen px-2 sm:px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

        {/* Left Sidebar */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="rounded-3xl p-6 sticky top-24 bg-white dark:bg-[#10131A] bg-opacity-70 dark:bg-opacity-80 backdrop-blur-2xl shadow-xl border border-white/20 dark:border-[#2F2F3A] transition-all duration-300">
            <FeedSidebar />
          </div>
        </aside>

        {/* Main Feed */}
        <main className="w-full lg:w-2/4 space-y-8">

          {/* 🎥 Stories Bar */}
          <StoriesBar />

          {/* Create Post - Glass Effect */}
          <div className="rounded-3xl p-6 bg-white dark:bg-[#10131A] bg-opacity-70 dark:bg-opacity-80 backdrop-blur-2xl shadow-xl border border-white/20 dark:border-[#2F2F3A] transition-all duration-300 transform hover:scale-[1.01]">
            <CreatePost />
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            <FeedPosts />
          </div>
        </main>

        {/* Right Suggestions */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="rounded-3xl p-6 sticky top-24 bg-white dark:bg-[#10131A] bg-opacity-70 dark:bg-opacity-80 backdrop-blur-2xl shadow-xl border border-white/20 dark:border-[#2F2F3A] transition-all duration-300">
            <DeveloperSuggestions />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;






