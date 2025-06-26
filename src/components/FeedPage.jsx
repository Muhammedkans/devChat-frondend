// src/pages/FeedPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeedPosts from './FeedPosts';
import DeveloperSuggestions from './DeveloperSuggestions';
import FeedSidebar from './FeedSidebar';
import useMyProfile from '../hooks/useMyProfile';
import { useSelector } from 'react-redux'; // ✅
import CreatePost from './CreatePost';
import UserSearchBar from './UserSearchbar';


const FeedPage = () => {
  const navigate = useNavigate();
  const user = useSelector(store => store.user); // ✅ Redux user check
  const { data, error, isLoading } = useMyProfile();

  // ✅ Spot redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true }); // 🚀 fast redirect
    }
  }, [user, navigate]);

  // ✅ Check for auth failure from query too (cookie expired)
  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate("/login", { replace: true });
    }
  }, [error, navigate]);

  // ❌ Don't show spinner if unauthorized or loading
  if (!user || isLoading || error?.response?.status === 401) return null;

  // ✅ Authenticated
  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <div className="w-1/4 border-r p-4">
      
        <FeedSidebar />
      </div>
      <div className="w-2/4 p-4">
      <UserSearchBar/>
        <CreatePost/>
        <FeedPosts />
      </div>
      <div className="w-1/4 border-l p-4">
        <DeveloperSuggestions />
      </div>
    </div>
  );
};

export default FeedPage;



