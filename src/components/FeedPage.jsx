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
  const user = useSelector(store => store.user);
  const { data, error, isLoading } = useMyProfile();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login", { replace: true });
    }
  }, [error, navigate]);

  if (!user || isLoading || error?.response?.status === 401) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-2 sm:px-4 py-4">
      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <FeedSidebar />
          </div>
        </aside>

        {/* Main Feed */}
        <main className="w-full lg:w-2/4 space-y-6">
          <div className="bg-white rounded-lg shadow p-4">
            <UserSearchBar />
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <CreatePost />
          </div>
          <FeedPosts />
        </main>

        {/* Right Suggestions */}
        <aside className="lg:w-1/4 hidden lg:block">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <DeveloperSuggestions />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;




