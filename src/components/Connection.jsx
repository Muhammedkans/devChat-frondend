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
        console.log("Fetch connections failed:", err.message);
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (!connections) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Your Connections</h1>

      {connections.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">No Connections Found</p>
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

            return (
              <div
                key={_id}
                className="bg-gray-900 text-white p-4 rounded-xl shadow-md flex items-center gap-4"
              >
                <img
                  src={photoUrl}
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-sm text-gray-400">{about || "No about info"}</p>
                  {age && gender && (
                    <p className="text-xs text-gray-500">
                      {age} years old, {gender}
                    </p>
                  )}
                </div>

                <Link to={`/chat/${_id}`}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full">
                    Chat
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;
