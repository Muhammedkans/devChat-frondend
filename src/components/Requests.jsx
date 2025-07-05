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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100">
        <div className="text-center text-2xl text-gray-600 font-semibold">
          😔 No Friend Requests Found <br /> Try connecting with more developers!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          🔔 Friend Requests
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {requests
            .filter((req) => req?._id && req?.fromUserId)
            .map((req) => {
              const user = req.fromUserId;
              return (
                <div
                  key={req._id}
                  className="bg-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center gap-4 hover:shadow-lg transition"
                >
                  <img
                    src={
                      user.photoUrl ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt="profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-400"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/users/${user._id}`} className="block hover:underline">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.about || "No bio available"}
                      </p>
                      {user.age && user.gender && (
                        <p className="text-xs text-gray-500">
                          {user.age} years old, {user.gender}
                        </p>
                      )}
                    </Link>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-center">
                    <button
                      onClick={() => handleReview("rejected", req._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm transition"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview("accepted", req._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm transition"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Requests;





