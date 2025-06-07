// src/components/FeedSidebar.jsx
import { useNavigate } from "react-router-dom";
import useMyProfile from "../hooks/useMyProfile";


const FeedSidebar = () => {
  const { data: user, isLoading } = useMyProfile();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile photo */}
      <img
        src={user?.photoUrl}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border"
      />
      <p className="text-lg font-semibold">
        {user?.firstName} {user?.lastName}
      </p>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
        className="text-red-500 hover:underline"
      >
        Logout
      </button>
    </div>
  );
};

export default FeedSidebar;
