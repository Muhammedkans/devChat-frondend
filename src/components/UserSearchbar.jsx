import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { followUser, unfollowUser } from "../api/followApi";
import useMyProfile from "../hooks/useMyProfile";
import { useQueryClient } from "@tanstack/react-query";

const UserSearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [requestedIds, setRequestedIds] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [existingRequests, setExistingRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const queryClient = useQueryClient();
  const { data: myProfile } = useMyProfile();

  useEffect(() => {
    if (myProfile?.following) setFollowingIds(myProfile.following.map(id => id.toString()));
    if (myProfile?.friends) setFriendsList(myProfile.friends.map(id => id.toString()));
    if (myProfile?.requests) setRequestedIds(myProfile.requests.map(id => id.toString()));
  }, [myProfile]);

  useEffect(() => {
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      try {
        setLoadingStatus(true);
        const res = await API.get(`/search/users?q=${query}`);
        const users = res.data.data || [];
        setResults(users);

        const userIds = users.map((u) => u._id);
        const statusRes = await API.post(`/request/status/bulk`, { userIds });
        setExistingRequests((statusRes.data.requestedIds || []).map(id => id.toString()));

        const friendsStatusRes = await API.post(`/friends/status/bulk`, { userIds });
        const friendIds = (friendsStatusRes.data.friendIds || []).map(id => id.toString());
        setFriendsList(friendIds);
      } catch (err) {
        console.error("Search failed:", err.message);
      } finally {
        setLoadingStatus(false);
      }
    }, 300);

    setTypingTimeout(timeout);
  }, [query]);

  const handleFollowToggle = async (userId) => {
    try {
      if (followingIds.includes(userId)) {
        await unfollowUser(userId);
        setFollowingIds(prev => prev.filter(id => id !== userId));
      } else {
        await followUser(userId);
        setFollowingIds(prev => [...prev, userId]);
      }
      queryClient.invalidateQueries(["my-profile"]);
    } catch (err) {
      console.error("Follow error:", err.message);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const res = await API.post(`/request/send/interested/${userId}`);
      setRequestedIds(prev => [...prev, userId]);
      setExistingRequests(prev => [...prev, userId]);
      queryClient.invalidateQueries(["my-profile"]);
    } catch (err) {
      console.error("Friend request error:", err.response?.data || err.message);
    }
  };

  const isOwnUser = (id) => id === myProfile?._id;

  return (
    <div className="w-full mb-6">
      <form onSubmit={(e) => e.preventDefault()} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search developers..."
          className="w-full px-4 py-2 rounded-lg border border-gray-400 bg-white text-gray-800 focus:outline-none focus:ring focus:border-blue-500 shadow"
        />
      </form>

      <div className="space-y-4">
        {!loadingStatus && results.map((user) => {
          const userId = user._id.toString();
          const isFollowing = followingIds.includes(userId);
          const isRequested = requestedIds.includes(userId) || existingRequests.includes(userId);
          const isFriend = friendsList.includes(userId);

          if (isOwnUser(userId)) return null;

          return (
            <div
              key={user._id}
              className="bg-white text-gray-800 p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <Link to={`/users/${user._id}`} className="flex items-center gap-4">
                <img
                  src={user.photoUrl}
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-400"
                />
                <div>
                  <p className="font-semibold text-lg">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.about || "No bio available"}</p>
                </div>
              </Link>

              <div className="flex flex-wrap gap-2 justify-end">
                {isFriend ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Friend ✓
                  </span>
                ) : isRequested ? (
                  <button
                    disabled
                    className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium cursor-not-allowed"
                  >
                    Requested
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(userId)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    Add Friend
                  </button>
                )}

                <button
                  onClick={() => handleFollowToggle(userId)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    isFollowing
                      ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          );
        })}

        {results.length === 0 && query.trim() !== "" && !loadingStatus && (
          <p className="text-center text-gray-500 mt-6">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearchBar;






















