import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constant";
import { MessageCircle, UserX, ShieldCheck, ExternalLink, Users } from "lucide-react";
import toast from "react-hot-toast";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/connection`, {
          withCredentials: true,
        });
        dispatch(addConnection(res?.data?.data));
      } catch (err) {
        console.error("❌ Fetch connections failed:", err.message);
        toast.error("Could not load your network.");
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (!connections) return null;

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* 🏷️ Header Section */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] mb-2">
          Your Network
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Manage your professional relationships and collaborate.
        </p>
      </div>

      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#10131A]/50 rounded-[3rem] border border-white/20 dark:border-[#2F2F3A] backdrop-blur-3xl text-center">
          <div className="w-24 h-24 bg-[#0F82FF]/10 rounded-full flex items-center justify-center mb-6">
            <Users className="w-10 h-10 text-[#0F82FF]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Grow Your Circle</h2>
          <p className="text-gray-500 max-w-md mb-8">You haven't connected with anyone yet. Explore the community to find like-minded developers.</p>
          <Link to="/" className="px-8 py-3 bg-[#0F82FF] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
            Discover People
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            if (!connection?._id) return null;

            const {
              _id,
              firstName,
              lastName,
              photoUrl,
              about,
              isPremium
            } = connection;

            return (
              <div
                key={_id}
                className="group relative bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] p-6 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 backdrop-blur-3xl flex flex-col justify-between"
              >
                {/* 🌟 Card Content */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative cursor-pointer" onClick={() => navigate(`/users/${_id}`)}>
                    <div className="absolute inset-0 bg-[#0F82FF] blur-lg opacity-0 group-hover:opacity-20 transition-opacity rounded-full"></div>
                    <img
                      src={photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`}
                      alt={`${firstName}`}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-[#2F2F3A] shadow-lg relative z-10"
                    />
                    {isPremium && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full border-2 border-white dark:border-[#10131A] shadow-sm z-20">
                        <ShieldCheck className="w-3 h-3 text-white fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link to={`/users/${_id}`} className="block">
                      <h2 className="text-lg font-black text-gray-900 dark:text-white truncate group-hover:text-[#0F82FF] transition-colors">
                        {firstName} {lastName}
                      </h2>
                    </Link>
                    <p className="text-xs font-bold text-[#0F82FF] uppercase tracking-wider mb-1">Developer</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                      {about || "Building something incredible."}
                    </p>
                  </div>
                </div>

                {/* ⚡ Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#2F2F3A]">
                  <Link
                    to={`/chat/${_id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0F82FF] hover:bg-[#0A66C2] text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Message
                  </Link>

                  <Link
                    to={`/users/${_id}`}
                    className="p-3 bg-gray-100 dark:bg-[#1A1B1F] text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-[#2F2F3A] transition-all active:scale-95"
                    title="View Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-95"
                    title="Remove Connection"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;



