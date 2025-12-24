import { useNavigate, Link } from 'react-router-dom';
import useMyProfile from '../hooks/useMyProfile';
import Profilephoto from './Profilephoto';
import useMyPosts from '../hooks/useMyposts';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProfileAnalytics } from '../api/analyticsApi';
import { Eye, Edit3, Settings, Grid, Heart, MessageSquare, Star, Crown } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useMyProfile();
  const { data: posts = [], isLoading: loadingPosts } = useMyPosts();

  // 📈 Fetch Analytics
  const { data: analytics } = useQuery({
    queryKey: ['profile-analytics'],
    queryFn: getProfileAnalytics,
    enabled: !!user
  });

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate('/login');
    }
  }, [error, navigate]);

  if (isLoading) return <div className="text-center mt-20 text-[#0F82FF] font-bold animate-pulse">Loading Your Space...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 animate-in fade-in slide-in-from-bottom-5 duration-700">

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* 🚀 Sidebar: Profile Info Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#10131A] bg-opacity-70 dark:bg-opacity-80 backdrop-blur-2xl shadow-xl border border-white/20 dark:border-[#2F2F3A] p-10 transition-all duration-500">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F82FF15] rounded-full blur-3xl"></div>

            <div className="flex flex-col items-center">
              <Profilephoto />

              <div className="mt-6 text-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {`${user?.firstName} ${user?.lastName}`}
                </h2>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F82FF10] text-[#0F82FF] text-xs font-bold uppercase tracking-wider">
                  {user?.isPremium && <Crown className="w-3 h-3" />}
                  {user?.isPremium ? 'Premium Member' : 'Standard Member'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed line-clamp-3">
                  {user?.about || "No bio added yet. Add one to stand out!"}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 w-full mt-8 pt-8 border-t border-gray-100 dark:border-[#2F2F3A]">
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{user?.postsCount}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{user?.followersCount}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fans</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{user?.followingCount}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Icons</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-3 mt-8">
                <button
                  onClick={() => navigate('/editProfile')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0F82FF] text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gray-100 dark:bg-[#1A1B1F] text-gray-700 dark:text-gray-300 font-bold text-sm border border-gray-200 dark:border-[#2F2F3A] hover:bg-gray-200 dark:hover:bg-[#2F2F3A] transition-all duration-300">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* 📈 Analytics Card */}
          <div className="rounded-[2rem] bg-gradient-to-br from-[#0F82FF] to-[#B44CFF] p-8 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg uppercase tracking-tight">Performance</h3>
              <Eye className="w-5 h-5 opacity-70" />
            </div>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-black">{analytics?.totalViews || 0}</p>
              <p className="text-sm font-bold opacity-80 mb-2">Profile Views</p>
            </div>
            <p className="mt-4 text-xs font-medium opacity-90 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/10">
              {user?.isPremium
                ? "Your profile is gaining traction! Check who visited below."
                : "Upgrade to Premium to see who exactly is viewing your profile!"}
            </p>
            {!user?.isPremium && (
              <Link to="/premium" className="mt-4 w-full py-2.5 bg-white text-[#0F82FF] rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                <Star className="w-3.5 h-3.5 fill-[#0F82FF]" />
                UPGRADE NOW
              </Link>
            )}
          </div>
        </div>

        {/* 📸 Main Content Area: Posts Grid */}
        <div className="w-full lg:w-2/3">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white dark:bg-[#10131A] rounded-2xl shadow-md border border-gray-100 dark:border-[#2F2F3A] text-[#0F82FF]">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">Your Creator Hub</h2>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-500 mt-1 uppercase tracking-widest">{posts.length} SHARED MOMENTS</p>
            </div>
          </div>

          {loadingPosts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square rounded-3xl bg-gray-200 dark:bg-[#1A1B1F] animate-pulse"></div>)}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-[#2F2F3A] bg-gray-50/50 dark:bg-black/5">
              <p className="text-gray-400 dark:text-gray-500 font-black text-xl mb-4">NO CONTENT YET</p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-[#0F82FF10] text-[#0F82FF] rounded-full font-bold text-sm hover:bg-[#0F82FF] hover:text-white transition-all"
              >
                CREATE YOUR FIRST POST
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="group relative aspect-square bg-white dark:bg-[#10131A] rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 dark:border-[#2F2F3A] hover:shadow-2xl hover:scale-[1.03] transition-all duration-500"
                >
                  {post.contentImageUrl ? (
                    <img
                      src={post.contentImageUrl}
                      alt="Post"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full p-6 flex items-center justify-center text-center bg-gray-50 dark:bg-black/20">
                      <p className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-6">
                        {post.contentText}
                      </p>
                    </div>
                  )}
                  {/* Stats Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white font-black">
                    <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <Heart className="w-5 h-5 fill-white" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                      <MessageSquare className="w-5 h-5 fill-white" />
                      <span>{post.commentCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;






