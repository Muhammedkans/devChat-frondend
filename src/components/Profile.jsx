import { useSelector } from "react-redux";
import EditProfile from "./EditProfile.jsx";

const Profile = () => {
  const user = useSelector((store) => store.user);
  console.log("Profile user object:", user);

 
  return (
   
    user && (
      <div>
        <EditProfile user={user} />
      </div>
    )
  );
};
export default Profile;