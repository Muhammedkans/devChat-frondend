import { useNavigate, Link } from "react-router-dom";
import useMyProfile from "../hooks/useMyProfile";
import { User, ShieldCheck, Heart, Grid, Users, Layout } from "lucide-react";

const FeedSidebar = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="w-20 h-20 bg-gray-200 dark:bg-[#1A1B1F] rounded-2xl mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-[#1A1B1F] rounded-full w-3/4 mx-auto"></div>
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
      <div className="relative group cursor-pointer mb-2" onClick={() => navigate('/profile')}>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] rounded-[2rem] blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        <img
          src={user?.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.firstName}`}
          alt="Profile"
          className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white dark:border-[#2F2F3A] shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
        />
        {user?.isPremium && (
          <div className="absolute -bottom-2 -right-2 z-20 bg-yellow-400 p-1.5 rounded-full border-4 border-white dark:border-[#10131A] shadow-lg animate-bounce-slow">
            <ShieldCheck className="w-4 h-4 text-white fill-white" />
          </div>
        )}
      </div>

      <div className="mt-4 text-center space-y-1">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
          {user?.firstName} {user?.lastName}
        </h3>
        <p className="text-[10px] font-bold text-[#0F82FF] uppercase tracking-[0.3em]">
          {user?.isPremium ? "Elite Member" : "Developer"}
        </p>
      </div>

      {/* 📊 Quick Stats */}
      <div className="grid grid-cols-2 gap-3 w-full mt-6 py-4 px-2 bg-gray-50/50 dark:bg-[#1A1B1F]/50 rounded-2xl border border-gray-100 dark:border-[#2F2F3A]">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center group">
            <p className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[#0F82FF] transition-colors">
              {stat.value}
            </p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1">
              <stat.icon className="w-3 h-3" />
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* 🧭 Quick Links */}
      <div className="w-full mt-6 space-y-3">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#1A1B1F] border border-gray-100 dark:border-[#2F2F3A] text-gray-600 dark:text-gray-300 text-xs font-bold hover:shadow-lg hover:border-[#0F82FF]/30 transition-all duration-300 group"
        >
          <User className="w-4 h-4 text-[#0F82FF] group-hover:scale-110 transition-transform" />
          View Profile
        </button>

        {!user?.isPremium && (
          <Link
            to="/premium"
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 text-yellow-600 dark:text-yellow-500 text-xs font-bold border border-yellow-500/20 hover:from-[#FFD700] hover:to-[#FFA500] hover:text-white transition-all duration-300 group"
          >
            <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            Get Verified
          </Link>
        )}
      </div>
    </div>
  );
};

export default FeedSidebar;







