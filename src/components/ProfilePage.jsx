import { useNavigate } from 'react-router-dom';
import useMyProfile from '../hooks/useMyProfile';
import Profilephoto from './Profilephoto';
import useMyPosts from '../hooks/useMyposts';
import { useEffect } from 'react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyProfile();
  const { data: posts = [], isLoading: loadingPosts } = useMyPosts();

  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate('/login');
    }
  }, [error, navigate]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 py-10 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Profile Photo */}
      <Profilephoto />

      {/* User Info */}
      <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-center">
        {`${data?.firstName} ${data?.lastName}`}
      </h2>
      <p className="text-sm sm:text-base text-gray-700 text-center mt-1 max-w-md">{data?.about}</p>

      {/* Stats */}
      <div className="flex justify-center gap-6 mt-6 text-center text-gray-800 w-full max-w-xs">
        <div>
          <div className="text-lg font-bold">{data.postsCount}</div>
          <div className="text-xs sm:text-sm">Posts</div>
        </div>
        <div>
          <div className="text-lg font-bold">{data.followersCount}</div>
          <div className="text-xs sm:text-sm">Followers</div>
        </div>
        <div>
          <div className="text-lg font-bold">{data.followingCount}</div>
          <div className="text-xs sm:text-sm">Following</div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button
        className="mt-6 px-6 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition text-sm font-medium"
        onClick={() => navigate('/editProfile')}
      >
        ✏️ Edit Profile
      </button>

      {/* Posts Grid */}
      <div className="w-full max-w-6xl mt-10 px-2 sm:px-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center sm:text-left">
          📸 Your Posts
        </h2>

        {loadingPosts ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts?.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="aspect-square bg-white rounded-lg overflow-hidden shadow hover:scale-105 transition"
              >
                <img
                  src={post.contentImageUrl}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;




