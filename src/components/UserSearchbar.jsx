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
  const [loadingStatus, setLoadingStatus] = useState(false); // ✅ Prevent flicker

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
        setLoadingStatus(true); // ✅
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
        setLoadingStatus(false); // ✅
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

      // 🔁 Refresh profile to update DeveloperSuggestions
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

      queryClient.invalidateQueries(["my-profile"]); // 🔁 to update suggestions
    } catch (err) {
      console.error("Friend request error:", err.response?.data || err.message);
    }
  };

  const isOwnUser = (id) => id === myProfile?._id;

  return (
    <div className="space-y-4">
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search developers..."
          className="flex-1 px-4 py-2 border rounded focus:outline-none"
        />
      </form>

      <div className="space-y-3">
        {!loadingStatus && results.map((user) => {
          const userId = user._id.toString();
          const isFollowing = followingIds.includes(userId);
          const isRequested = requestedIds.includes(userId) || existingRequests.includes(userId);
          const isFriend = friendsList.includes(userId);

          if (isOwnUser(userId)) return null; // ❌ Skip own user

          return (
            <div
              key={user._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <Link to={`/users/${user._id}`} className="flex items-center gap-3">
                <img
                  src={user.photoUrl}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.about}</p>
                </div>
              </Link>

              <div className="flex gap-2">
                {isFriend ? (
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">Friend ✓</span>
                ) : isRequested ? (
                  <button
                    disabled
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Requested
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(userId)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Add Friend
                  </button>
                )}

                <button
                  onClick={() => handleFollowToggle(userId)}
                  className={`text-white px-2 py-1 rounded text-sm ${
                    isFollowing ? "bg-gray-600" : "bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          );
        })}

        {results.length === 0 && query.trim() !== "" && !loadingStatus && (
          <p className="text-center text-gray-500">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearchBar;



















