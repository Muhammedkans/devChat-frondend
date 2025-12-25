import axios from 'axios';
import React, { useEffect } from 'react';
import { API_URL } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequests } from '../utils/requestSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserCheck, UserX, Inbox, ArrowRight } from 'lucide-react';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/request/review/recieved`, {
          withCredentials: true,
        });
        dispatch(addRequests(res.data.data));
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };
    fetchRequests();
  }, [dispatch]);

  const handleReview = async (status, requestId) => {
    const toastId = toast.loading("Processing...");
    try {
      await axios.post(`${API_URL}/request/review/${status}/${requestId}`, {}, {
        withCredentials: true,
      });
      dispatch(removeRequests(requestId));
      toast.success(status === 'accepted' ? "Connection established! 🎉" : "Request ignored", { id: toastId });
    } catch (err) {
      toast.error("Failed to update request", { id: toastId });
      console.error("Review failed", err);
    }
  };

  if (!requests) return null;

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* 🏷️ Header Section */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] mb-2">
          Connection Requests
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Expand your network by accepting requests from developers.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-[#10131A]/50 rounded-[3rem] border border-white/20 dark:border-[#2F2F3A] backdrop-blur-3xl text-center shadow-lg">
          <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
            <Inbox className="w-10 h-10 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Pending Invitations</h2>
          <p className="text-gray-500 max-w-md mb-8">You're all caught up! Explore the feed to find more people to connect with.</p>
          <Link to="/" className="px-8 py-3 bg-[#0F82FF] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
            Browse Community
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests
            .filter((req) => req?._id && req?.fromUserId)
            .map((req) => {
              const user = req.fromUserId;
              return (
                <div
                  key={req._id}
                  className="group relative bg-white/70 dark:bg-[#10131A]/80 border border-white/20 dark:border-[#2F2F3A] p-6 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 backdrop-blur-3xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <Link to={`/users/${user._id}`} className="relative group/img cursor-pointer mb-4">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#0F82FF] to-[#B44CFF] rounded-full blur-md opacity-0 group-hover/img:opacity-50 transition-opacity duration-500"></div>
                      <img
                        src={user.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`}
                        alt="profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#2F2F3A] shadow-xl relative z-10"
                      />
                    </Link>

                    <Link to={`/users/${user._id}`} className="block hover:text-[#0F82FF] transition-colors mb-1">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </h3>
                    </Link>
                    <p className="text-xs font-bold text-[#0F82FF] uppercase tracking-wider mb-3">Wants to Connect</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6 h-10">
                      {user.about || "A passionate developer ready to connect."}
                    </p>

                    <div className="flex items-center gap-3 w-full">
                      <button
                        onClick={() => handleReview("rejected", req._id)}
                        className="flex-1 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl font-bold text-sm transition-all"
                      >
                        <UserX className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleReview("accepted", req._id)}
                        className="flex-[3] py-3 bg-[#0F82FF] hover:bg-[#0A66C2] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Requests;





