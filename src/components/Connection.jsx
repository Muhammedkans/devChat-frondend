import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { API_URL } from "../utils/constant";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/connection`, {
          withCredentials: true,
        });
        dispatch(addConnection(res?.data?.data));
      } catch (err) {
        console.error("❌ Fetch connections failed:", err.message);
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (!connections) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center text-gray-800">
          👥 Your Connections
        </h1>

        {connections.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No Connections Found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {connections.map((connection) => {
              if (!connection?._id) return null;

              const {
                _id,
                firstName,
                lastName,
                photoUrl,
                about,
                age,
                gender,
              } = connection;

              const profileImage =
                photoUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`;

              return (
                <div
                  key={_id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 flex items-center gap-4"
                >
                  <img
                    src={profileImage}
                    alt={`${firstName} ${lastName}`}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-300"
                  />

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {firstName} {lastName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {about || "No bio available"}
                    </p>
                    {age && gender && (
                      <p className="text-xs text-gray-500 mt-1">
                        {age} years old, {gender}
                      </p>
                    )}
                  </div>

                  <Link to={`/chat/${_id}`}>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:opacity-90 text-sm shadow">
                      💬 Chat
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;



