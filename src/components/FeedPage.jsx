import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedPosts from './FeedPosts';
import DeveloperSuggestions from './DeveloperSuggestions';
import FeedSidebar from './FeedSidebar';
import useMyProfile from '../hooks/useMyProfile';
import { useSelector } from 'react-redux';
import CreatePost from './CreatePost';
import UserSearchBar from './UserSearchbar';

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
    <div className="min-h-screen bg-gradient-to-br from-[#0D0C1D] via-[#15161C] to-[#0E0F13] px-2 sm:px-4 py-6 text-white">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">

        {/* Left Sidebar */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="rounded-2xl p-5 sticky top-4 bg-[#10131A] bg-opacity-90 backdrop-blur-xl shadow-[0_0_15px_#0F82FF22] border border-[#2F2F3A]">
            <FeedSidebar />
          </div>
        </aside>

        {/* Main Feed */}
        <main className="w-full lg:w-2/4 space-y-6">
          {/* Search Bar */}
          <div className="rounded-2xl p-5 bg-[#10131A] bg-opacity-90 backdrop-blur-xl shadow-[0_0_15px_#B44CFF22] border border-[#2F2F3A]">
            <UserSearchBar />
          </div>

          {/* Create Post */}
          <div className="rounded-2xl p-5 bg-[#10131A] bg-opacity-90 backdrop-blur-xl shadow-[0_0_15px_#0F82FF22] border border-[#2F2F3A]">
            <CreatePost />
          </div>

          {/* Posts Feed */}
          <FeedPosts />
        </main>

        {/* Right Suggestions */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="rounded-2xl p-5 sticky top-4 bg-[#10131A] bg-opacity-90 backdrop-blur-xl shadow-[0_0_15px_#0F82FF22] border border-[#2F2F3A]">
            <DeveloperSuggestions />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;






