import { useNavigate } from 'react-router-dom';
import useMyProfile from '../hooks/useMyProfile';
import Profilephoto from './Profilephoto';
import useMyPosts from '../hooks/useMyposts';
import { useEffect } from 'react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyProfile();
  const {
    data: posts = [],
    isLoading: loadingPosts,
  } = useMyPosts();

  // 🔐 Redirect to login if token is invalid or missing
  useEffect(() => {
    if (error?.response?.status === 401) {
      navigate('/login');
    }
  }, [error, navigate]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-y-auto px-4 py-10 bg-white">
      <Profilephoto />
      <h2 className="text-2xl font-bold">{`${data?.firstName} ${data?.lastName}`}</h2>
      <p className="text-sm text-gray-600">{data?.about}</p>

      <div className="flex justify-center gap-8 mt-4 text-center text-sm text-gray-800">
        <div>
          <div className="text-lg font-bold">{data.postsCount}</div>
          <div>Posts</div>
        </div>
        <div>
          <div className="text-lg font-bold">{data.followersCount}</div>
          <div>Followers</div>
        </div>
        <div>
          <div className="text-lg font-bold">{data.followingCount}</div>
          <div>Following</div>
        </div>
      </div>

      <button
        className="mt-4 px-4 py-2 border rounded"
        onClick={() => navigate('/editProfile')}
      >
        Edit Profile
      </button>

      <div className="w-full max-w-4xl mt-10 px-4">
        <h2 className="text-xl font-bold mb-4">Your Posts</h2>

        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : posts?.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="aspect-square bg-gray-200 rounded overflow-hidden shadow"
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



