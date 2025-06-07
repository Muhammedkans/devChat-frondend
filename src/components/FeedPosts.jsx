import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PostCard from "./PostCard";
import API from "../api";

const fetchFeed = async () => {
  const res = await API.get("/postFeed", {
    withCredentials: true,
  });
  return res.data.data;
};

const FeedPosts = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["feedPosts"],
    queryFn: fetchFeed,
  });
if (isLoading) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center text-gray-500 mt-10">
      📦 Loading posts...
    </div>
  );
}

if (isError) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center text-red-500 mt-10">
      🚫 Error: {error.message}
    </div>
  );
}

if (posts.length === 0) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center text-gray-400 mt-10">
      <p>😶 No posts found yet.</p>
      <p>Start by creating a new post!</p>
    </div>
  );
}

  return (
     <div className="w-full max-w-2xl mx-auto px-4">
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  </div>
  );
};

export default FeedPosts;