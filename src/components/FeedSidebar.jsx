import { useNavigate, Link } from "react-router-dom";
import useMyProfile from "../hooks/useMyProfile";
import { User, ShieldCheck, Heart, Grid, Users, Layout } from "lucide-react";

const FeedSidebar = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="w-20 h-20 bg-gray-200 dark:bg-[#1A1B1F] rounded-full mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#1A1B1F] rounded-full w-3/4 mx-auto"></div>
        <div className="h-3 bg-gray-200 dark:bg-[#1A1B1F] rounded-full w-1/2 mx-auto"></div>
      </div>
    );
  }

  const stats = [
    { label: "Posts", value: user?.postsCount || 0, icon: Layout },
    { label: "Fans", value: user?.followersCount || 0, icon: Users },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* 👤 Profile Header */}
      <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] rounded-full blur-md opacity-20 group-hover:opacity-50 transition-opacity duration-500"></div>
        <img
          src={user?.photoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#10131A] shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="mt-6 text-center space-y-1">
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-[10px] font-bold text-[#0F82FF] uppercase tracking-[0.2em]">
          {user?.isPremium ? "Elite Member" : "Developer"}
        </p>
      </div>

      {/* 📊 Quick Stats */}
      <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-8 border-t border-gray-100 dark:border-[#2F2F3A]">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center group">
            <p className="text-lg font-black text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">
              {stat.value}
            </p>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* 🧭 Quick Links */}
      <div className="w-full mt-8 space-y-2">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0F82FF10] text-[#0F82FF] text-xs font-bold hover:bg-[#0F82FF] hover:text-white transition-all duration-300 group"
        >
          <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
          View Profile
        </button>
        <Link
          to="/premium"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-bold hover:from-yellow-500 hover:to-orange-500 hover:text-white transition-all duration-300 group"
        >
          <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Elite Badge
        </Link>
      </div>
    </div>
  );
};

export default FeedSidebar;







