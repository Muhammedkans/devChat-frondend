import axios from 'axios';
import React, { useEffect } from 'react';
import { API_URL } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequests } from '../utils/requestSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  // ✅ Fetch friend requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(API_URL + "/request/review/recieved", {
          withCredentials: true,
        });
        dispatch(addRequests(res.data.data));
      } catch (err) {
        console.error("Failed to fetch requests", err);
      }
    };
    fetchRequests();
  }, [dispatch]);

  // ✅ Accept / Reject handler with toast
  const handleReview = async (status, requestId) => {
    try {
      await axios.post(`${API_URL}/request/review/${status}/${requestId}`, {}, {
        withCredentials: true,
      });
      dispatch(removeRequests(requestId));
      toast.success(`Request ${status}`);
    } catch (err) {
      toast.error("Failed to update request");
      console.error("Review failed", err);
    }
  };

  if (!requests) return null;
  if (requests.length === 0) {
    return (
      <div className="text-center text-2xl mt-10 text-gray-400">
        No Friend Requests Found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Friend Requests</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {requests
          .filter((req) => req?.fromUserId && req._id)
          .map((req) => {
            const user = req.fromUserId;
            return (
              <div
                key={req._id}
                className="bg-gray-900 text-white p-4 rounded-xl shadow-md flex items-center gap-4"
              >
                <img
                  src={user.photoUrl}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                />

                <div className="flex-1">
                  <Link to={`/users/${user._id}`} className="block">
                    <h3 className="text-lg font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-400">{user.about || "No bio available"}</p>
                    {user.age && user.gender && (
                      <p className="text-xs text-gray-500">
                        {user.age} years old, {user.gender}
                      </p>
                    )}
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleReview("rejected", req._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleReview("accepted", req._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full text-sm"
                  >
                    Accept
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Requests;


