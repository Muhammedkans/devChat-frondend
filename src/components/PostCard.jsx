import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import useMyProfile from "../hooks/useMyProfile";

const PostCard = ({ post }) => {
  const { data: myUser } = useMyProfile();

  const hasLiked = post.likes.includes(myUser?._id);
  const [liked, setLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  // Comment UI states (only frontend)
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // later fetch from backend

  const toggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    const newComment = {
      text: commentText,
      user: {
        firstName: myUser?.firstName,
        lastName: myUser?.lastName,
        photoUrl: myUser?.photoUrl,
      },
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-6">
      {/* Top section with profile photo and name */}
      <div className="flex items-center mb-3">
        <img
          src={post.user?.photoUrl}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h2 className="font-semibold text-lg">
          {post.user?.firstName} {post.user?.lastName}
        </h2>
      </div>

      {/* Post content */}
      {post.contentText && <p className="text-gray-700 mb-2">{post.contentText}</p>}
      {post.contentImageUrl && (
        <img
          src={post.contentImageUrl}
          alt="Post"
          className="w-full mt-2 rounded-xl object-cover"
        />
      )}

      {/* Like + Comment icons */}
      <div className="mt-4 flex items-center space-x-4">
        <button onClick={toggleLike} className="focus:outline-none text-pink-500">
          {liked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
        </button>
        <span className="text-gray-600 text-sm">{likeCount} likes</span>

        <FaRegComment className="text-xl text-gray-500" />
      </div>

      {/* Comment input */}
      <form onSubmit={handleCommentSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 px-3 py-1 border border-gray-300 rounded-full text-sm"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          type="submit"
          className="text-sm text-blue-500 font-medium hover:underline"
        >
          Post
        </button>
      </form>

      {/* Comment list */}
      <div className="mt-3 space-y-2">
        {comments.map((comment, index) => (
          <div key={index} className="flex items-start gap-2">
            <img
              src={comment.user.photoUrl}
              alt="Comment user"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-sm">
              <span className="font-medium">
                {comment.user.firstName} {comment.user.lastName}
              </span>{" "}
              {comment.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;

