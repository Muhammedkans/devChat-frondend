import usePostFeed from "../hooks/usePostFeed";
import PostCard from "./PostCard";
import { Loader2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const FeedPosts = () => {
  const { data: posts = [], isLoading, isError } = usePostFeed();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-blue-600 font-medium">Loading your feed...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center mt-8 text-red-500 text-sm">
        Oops! Failed to load posts. Please try again later.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center mt-16 text-center text-gray-500">
        <p className="mb-4 text-lg font-medium">
          Your feed is empty.
        </p>
        <p className="text-sm mb-6">
          Follow other developers to see their posts here.
        </p>
        <Link
          to="/explore-developers"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          <UserPlus className="h-4 w-4" />
          Find Developers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-xl shadow p-4">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default FeedPosts;



