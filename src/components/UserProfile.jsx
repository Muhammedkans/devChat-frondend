import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  MessageSquare,
  UserCheck,
  UserPlus,
  Image as ImageIcon,
  Layout,
  ShieldCheck,
  Heart,
  Grid,
  ArrowLeft
} from "lucide-react";
import { recordProfileView } from "../api/analyticsApi";
import useUserProfile from "../hooks/useUserProfile"; // Confirmed this exists (it was useUserPosts.js renaming)
import useUserPosts from "../hooks/useUserPosts"; // Correct hook
import { followUser, unfollowUser } from "../api/followApi";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userResponse, isLoading, error: userError } = useUserProfile(userId);
  const user = userResponse?.data || userResponse; // Handle potential wrapping

  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useUserPosts(userId);

  // 👁️ Record Profile View
  useEffect(() => {
    if (userId) {
      recordProfileView(userId).catch(err => console.error("View track error:", err));
    }
  }, [userId]);

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-profile", userId]);
      toast.success(`Connected with ${user?.firstName}`);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-profile", userId]);
      toast.success(`Disconnected from ${user?.firstName}`);
    },
  });

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-[#0F82FF30] border-t-[#0F82FF] rounded-full animate-spin"></div>
      <p className="text-xs font-black text-[#0F82FF] uppercase tracking-[0.3em] animate-pulse">Accessing Profile</p>
    </div>
  );

  if (userError || !user) return (
    <div className="max-w-md mx-auto mt-20 p-8 rounded-[2rem] bg-white dark:bg-[#10131A] text-center shadow-2xl border border-red-500/20">
      <div className="p-4 bg-red-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
        <X className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase">User Hidden</h3>
      <p className="text-sm text-gray-500 mt-2">This developer's profile is currently private or doesn't exist.</p>
      <button onClick={() => navigate(-1)} className="mt-8 px-8 py-3 bg-[#0F82FF] text-white rounded-2xl font-bold flex items-center gap-2 mx-auto">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>
  );

  const handleFollowToggle = () => {
    if (user.isFollowing) unfollowMutation.mutate();
    else followMutation.mutate();
  };

  const handleMessageClick = () => {
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

      {/* 🚀 Sleek Header Card */}
      <div className="relative overflow-hidden rounded-[3rem] bg-white/70 dark:bg-[#10131A]/80 backdrop-blur-3xl shadow-2xl border border-white/20 dark:border-[#2F2F3A] p-8 sm:p-16 mb-12 group transition-all duration-500">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0F82FF08] dark:bg-[#0F82FF15] rounded-full blur-[100px] -mr-40 -mt-40 transition-all group-hover:bg-[#0F82FF15]"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-10">
          {/* 👤 Profile Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <img
              src={user.photoUrl}
              alt="Profile"
              className="w-40 h-40 sm:w-56 sm:h-56 rounded-[3rem] object-cover border-4 border-white dark:border-[#10131A] shadow-2xl relative z-10"
            />
            {user.isPremium && (
              <div className="absolute -bottom-2 -right-2 z-20 bg-yellow-400 p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-[#10131A]">
                <ShieldCheck className="text-white w-6 h-6 fill-white" />
              </div>
            )}
          </div>

          {/* 👤 Identity Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
                {user.firstName} {user.lastName}
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0F82FF10] text-[#0F82FF] font-black text-[10px] uppercase tracking-widest border border-[#0F82FF20]">
                {user.isPremium ? "Elite Member" : "MERN Developer"}
              </div>
            </div>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed font-medium">
              {user.about || "This developer prefers to let their code speak for itself. Connect to see what they're building!"}
            </p>

            {/* 📊 Premium Stats Bar */}
            <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-6 border-t border-gray-100 dark:border-[#2F2F3A]">
              <div className="text-center md:text-left">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{user.postsCount}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Creations</p>
              </div>
              <div className="text-center md:text-left border-x border-gray-100 dark:border-[#2F2F3A] px-8">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{user.followersCount}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Followers</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{user.followingCount}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Following</p>
              </div>
            </div>

            {/* 🧷 Quick Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-6">
              <button
                onClick={handleFollowToggle}
                className={`flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg ${user.isFollowing
                    ? "bg-gray-100 dark:bg-[#1A1B1F] text-gray-900 dark:text-white border border-gray-200 dark:border-[#2F2F3A]"
                    : "bg-[#0F82FF] text-white shadow-blue-500/20 hover:scale-105 active:scale-95"
                  }`}
              >
                {user.isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {user.isFollowing ? "Connected" : "Build Network"}
              </button>

              <button
                onClick={handleMessageClick}
                className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl border-2 border-gray-100 dark:border-[#2F2F3A] font-black text-xs uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-[#1A1B1F] transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🖼️ Premium Posts Grid */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#2F2F3A] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white dark:bg-[#10131A] rounded-2xl shadow-lg border border-gray-50 dark:border-[#2F2F3A] text-[#0F82FF]">
              <Layout className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Content Feed</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{posts.length} SHARED HIGHLIGHTS</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-[#0F82FF10] text-[#0F82FF] rounded-xl"><Grid className="w-5 h-5" /></button>
          </div>
        </div>

        {postsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square rounded-[2rem] bg-gray-100 dark:bg-[#1A1B1F] animate-pulse"></div>)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group relative aspect-square rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#10131A] shadow-lg border border-gray-100 dark:border-[#2F2F3A] transition-all duration-700 hover:shadow-2xl hover:scale-[1.02]"
              >
                {post.contentImageUrl ? (
                  <img
                    src={post.contentImageUrl}
                    alt="Post"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-gray-50 dark:bg-black/20">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center line-clamp-6 leading-relaxed">
                      "{post.contentText}"
                    </p>
                  </div>
                )}

                {/* Glass Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-2xl flex items-center gap-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 fill-white" /><span className="text-xs font-black">{post.likes?.length || 0}</span></div>
                    <div className="w-px h-4 bg-white/30"></div>
                    <div className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 fill-white" /><span className="text-xs font-black">{post.commentCount || 0}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 rounded-[3.5rem] bg-gray-50 dark:bg-[#10131A]/30 border-2 border-dashed border-gray-100 dark:border-[#2F2F3A]/50">
            <p className="text-gray-400 dark:text-gray-500 font-black text-xl uppercase tracking-widest">No Content Found</p>
            <p className="text-xs font-bold text-gray-400 mt-2">Connect with them to see what's being built.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;










