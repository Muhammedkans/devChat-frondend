import { recordProfileView } from "../api/analyticsApi";
import { useEffect } from "react";
import { MessageSquare, UserCheck, UserPlus, Image as ImageIcon, Layout } from "lucide-react";

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

  // 👁️ Record Profile View
  useEffect(() => {
    if (userId) {
      recordProfileView(userId).catch(err => console.error("View track error:", err));
    }
  }, [userId]);

  const followMutation = useMutation({
    mutationFn: () => followUser(userId),
    onSuccess: () => queryClient.invalidateQueries(["user-profile", userId]),
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId),
    onSuccess: () => queryClient.invalidateQueries(["user-profile", userId]),
  });

  if (isLoading) return <div className="text-center mt-20 text-[#0F82FF] animate-pulse font-bold">Loading Premium Profile...</div>;
  if (!user) return <div className="text-center mt-20 text-red-500 font-bold bg-red-500/10 p-4 rounded-2xl mx-auto max-w-sm">User not found</div>;

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
    <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* 🚀 Profile Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#10131A] bg-opacity-70 dark:bg-opacity-80 backdrop-blur-2xl shadow-2xl border border-white/20 dark:border-[#2F2F3A] p-8 sm:p-12 mb-10 transition-all duration-500">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#0F82FF22] to-transparent rounded-full blur-3xl -mr-32 -mt-32"></div>

        <div className="relative flex flex-col items-center">
          {/* 👤 Profile Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] rounded-full blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
            <img
              src={user.photoUrl}
              alt="Profile"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white dark:border-[#10131A] shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
            />
            {user.isPremium && (
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-20 bg-white dark:bg-[#10131A] p-1.5 rounded-full shadow-xl shadow-blue-500/20">
                <MdVerified className="text-[#0F82FF] w-6 h-6 sm:w-8 sm:h-8" />
              </div>
            )}
          </div>

          {/* 👤 Name & About */}
          <div className="mt-8 text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              {user.username || `${user.firstName} ${user.lastName}`}
            </h2>
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#0F82FF10] dark:bg-[#0F82FF15] text-[#0F82FF] font-bold text-sm tracking-wide">
              MERN Stack Developer
            </div>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
              {user.about || "Crafting premium user experiences across the MERN stack."}
            </p>
          </div>

          {/* 📊 High-Level Stats */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16 w-full mt-10 border-t border-b border-gray-100 dark:border-[#2F2F3A] py-8">
            <div className="text-center group cursor-pointer">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">{user.postsCount}</p>
              <p className="text-gray-500 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Posts</p>
            </div>
            <div className="text-center group cursor-pointer border-x border-gray-100 dark:border-[#2F2F3A]">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">{user.followersCount}</p>
              <p className="text-gray-500 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Followers</p>
            </div>
            <div className="text-center group cursor-pointer">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">{user.followingCount}</p>
              <p className="text-gray-500 dark:text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">Following</p>
            </div>
          </div>

          {/* 🧷 Dynamic Action Buttons */}
          <div className="mt-10 flex gap-4 w-full sm:w-auto">
            <button
              onClick={handleFollowToggle}
              disabled={followMutation.isLoading || unfollowMutation.isLoading}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg ${user.isFollowing
                  ? "bg-gray-200 dark:bg-[#1A1B1F] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#2c2c34]"
                  : "bg-gradient-to-r from-[#0F82FF] to-[#0F82FFCC] text-white hover:shadow-[0_0_20px_rgba(15,130,255,0.4)] transform hover:scale-105"
                }`}
            >
              {user.isFollowing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {user.isFollowing ? "Connected" : "Connect"}
            </button>

            <button
              onClick={handleMessageClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-[#2F2F3A] font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A1B1F] transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5" />
              Message
            </button>
          </div>
        </div>
      </div>

      {/* 🖼️ Premium Posts Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#0F82FF10] rounded-xl text-[#0F82FF]">
            <Layout className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Content Feed</h3>
        </div>

        {postsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square rounded-3xl bg-gray-200 dark:bg-[#1A1B1F] animate-pulse"></div>)}
          </div>
        ) : postsError ? (
          <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-red-500/10 text-red-500 font-bold">Failed to load content feed.</div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group relative aspect-square rounded-[2rem] overflow-hidden bg-white dark:bg-[#10131A] shadow-lg border border-white/20 dark:border-[#2F2F3A] hover:shadow-2xl transition-all duration-500"
              >
                {post.contentImageUrl ? (
                  <img
                    src={post.contentImageUrl}
                    alt="Post content"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#13141F] dark:to-[#1A1B1F]">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center line-clamp-6 leading-relaxed">
                      "{post.contentText}"
                    </p>
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-[3rem] bg-gray-100 dark:bg-[#10131A] border-2 border-dashed border-gray-200 dark:border-[#2F2F3A]">
            <p className="text-gray-400 dark:text-gray-500 font-bold text-xl uppercase tracking-widest">No Content Shared</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;










