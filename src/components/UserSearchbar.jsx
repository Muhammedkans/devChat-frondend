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
        setFollowingIds((prev) => prev.filter((id) => id !== userId));
      } else {
        await followUser(userId);
        setFollowingIds((prev) => [...prev, userId]);
      }
      queryClient.invalidateQueries(["my-profile"]);
    } catch (err) {
      console.error("Follow error:", err.message);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const res = await API.post(`/request/send/interested/${userId}`);
      console.log("Friend request success:", res.data);
      setRequestedIds((prev) => [...prev, userId]);
      setExistingRequests((prev) => [...prev, userId]);
      queryClient.invalidateQueries(["my-profile"]);
    } catch (err) {
      console.error("Friend request error:", err.response?.data || err.message);
    }
  };

  const isOwnUser = (id) => id === myProfile?._id;

  return (
    <div className="space-y-4 max-w-3xl mx-auto px-4 py-6">
      {/* 🔍 Search Input */}
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search developers..."
          className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white focus:outline-none"
        />
      </form>

      {/* 🔎 Results */}
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
              className="bg-gray-900 text-white p-4 rounded-xl shadow flex items-center justify-between"
            >
              <Link to={`/users/${user._id}`} className="flex items-center gap-4">
                <img
                  src={user.photoUrl}
                  alt="profile"
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
                <div>
                  <p className="font-semibold text-lg">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-400">{user.about || "No bio available"}</p>
                </div>
              </Link>

              <div className="flex gap-2 flex-col sm:flex-row mt-2 sm:mt-0">
                {/* Friend Button */}
                {isFriend ? (
                  <span className="bg-green-600 px-3 py-1 rounded text-sm">Friend ✓</span>
                ) : isRequested ? (
                  <button
                    disabled
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Requested
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(userId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Friend
                  </button>
                )}

                {/* Follow Button */}
                <button
                  onClick={() => handleFollowToggle(userId)}
                  className={`px-3 py-1 rounded text-sm text-white transition ${
                    isFollowing ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          );
        })}

        {results.length === 0 && query.trim() !== "" && !loadingStatus && (
          <p className="text-center text-gray-400">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearchBar;




















