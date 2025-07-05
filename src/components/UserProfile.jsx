import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "../api/followApi";
import { MdVerified } from "react-icons/md";
import useUserProfile from "../hooks/useUserPosts";
import useUserPosts from "../hooks/useUserPost";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useUserProfile(userId);
  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useUserPosts(userId);

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => queryClient.invalidateQueries(["user-profile", userId]),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => queryClient.invalidateQueries(["user-profile", userId]),
  });

  if (isLoading) return <div className="text-center mt-10">Loading profile...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">User not found</div>;

  const handleFollowToggle = () => {
    if (user.isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  const handleMessageClick = () => {
    navigate(`/chat/${user._id}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow min-h-screen">
      <div className="flex flex-col items-center">
        {/* 👤 Profile Image */}
        <div className="relative">
          <img
            src={user.photoUrl}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
          />
          {user.isPremium && (
            <MdVerified
              className="absolute bottom-0 right-0 bg-white rounded-full text-blue-600"
              size={22}
            />
          )}
        </div>

        {/* 👤 Name & About */}
        <h2 className="mt-4 text-2xl font-bold">
          {user.username || `${user.firstName} ${user.lastName}`}
        </h2>
        <p className="text-sm text-gray-500 mt-1 text-center">
          {user.about || "MERN Stack Developer | Kerala 🇮🇳"}
        </p>

        {/* 📊 Stats */}
        <div className="flex justify-around w-full mt-6 text-center">
          <div>
            <p className="text-lg font-bold">{user.postsCount}</p>
            <p className="text-gray-500 text-sm">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.followersCount}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.followingCount}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>

        {/* 🧷 Buttons */}
        <div className="mt-6 flex gap-3 flex-wrap justify-center">
          <button
            onClick={handleFollowToggle}
            disabled={followMutation.isLoading || unfollowMutation.isLoading}
            className={`px-6 py-2 rounded-full font-medium transition ${
              user.isFollowing
                ? "bg-gray-300 text-black hover:bg-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {user.isFollowing ? "Following" : "Follow"}
          </button>

          <button
            onClick={handleMessageClick}
            className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
          >
            Message
          </button>
        </div>
      </div>

      {/* 🖼️ Posts */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">📸 Posts</h3>

        {postsLoading ? (
          <p className="text-center text-gray-400">Loading posts...</p>
        ) : postsError ? (
          <p className="text-center text-red-500">Error loading posts.</p>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {posts.map((post) =>
              post.contentImageUrl || post.contentText ? (
                <div
                  key={post._id}
                  className="aspect-square bg-white rounded-lg overflow-hidden shadow p-2 flex flex-col justify-center items-center text-center hover:scale-105 transition"
                >
                  {/* 📝 Text */}
                  {post.contentText && (
                    <p className="text-sm text-gray-800 mb-2 line-clamp-4">
                      {post.contentText}
                    </p>
                  )}

                  {/* 🖼️ Image */}
                  {post.contentImageUrl && (
                    <img
                      src={post.contentImageUrl}
                      alt="Post"
                      className="w-full h-full object-cover rounded"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-center text-gray-400">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;










