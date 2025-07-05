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
          className="w-full px-4 py-2 rounded-xl bg-[#1F1F28] text-white border border-[#2F2F3A] placeholder-gray-400 focus:ring-2 focus:ring-[#0F82FF] focus:outline-none transition"
        />
      </form>

      <div className="space-y-4">
        {!loadingStatus &&
          results.map((user) => {
            const userId = user._id.toString();
            const isFollowing = followingIds.includes(userId);
            const isRequested = requestedIds.includes(userId) || existingRequests.includes(userId);
            const isFriend = friendsList.includes(userId);

            if (isOwnUser(userId)) return null;

            return (
              <div
                key={user._id}
                className="bg-[#1A1B1F] border border-[#2F2F3A] p-4 rounded-xl shadow-[0_0_20px_#0F82FF22] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white backdrop-blur-md"
              >
                <Link to={`/users/${user._id}`} className="flex items-center gap-4">
                  <img
                    src={user.photoUrl}
                    alt="profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#0F82FF]"
                  />
                  <div>
                    <p className="font-semibold text-lg">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-400">{user.about || "No bio available"}</p>
                  </div>
                </Link>

                <div className="flex flex-wrap gap-2 justify-end">
                  {isFriend ? (
                    <span className="bg-green-600/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      Friend ✓
                    </span>
                  ) : isRequested ? (
                    <button
                      disabled
                      className="bg-yellow-600/10 text-yellow-300 px-3 py-1 rounded-full text-sm font-medium cursor-not-allowed"
                    >
                      Requested
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(userId)}
                      className="bg-gradient-to-r from-green-500 to-lime-500 hover:brightness-110 text-white px-3 py-1 rounded-full text-sm font-medium transition"
                    >
                      Add Friend
                    </button>
                  )}

                  <button
                    onClick={() => handleFollowToggle(userId)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      isFollowing
                        ? "bg-[#2F2F3A] text-white hover:bg-[#444]"
                        : "bg-gradient-to-r from-[#0F82FF] to-[#B44CFF] text-white hover:brightness-110"
                    }`}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            );
          })}

        {results.length === 0 && query.trim() !== "" && !loadingStatus && (
          <p className="text-center text-gray-400 mt-6">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserSearchBar;























