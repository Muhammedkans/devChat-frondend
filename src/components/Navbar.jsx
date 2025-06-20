import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import { useQueryClient } from "@tanstack/react-query"; // ✅ Import this

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // ✅ Add this

  const handleLogout = async () => {
    try {
      await axios.post(API_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      queryClient.clear(); // ✅ Clear react-query cache
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <div className="navbar bg-black">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl text-white">
            devChat
          </Link>
        </div>

        {user && (
          <div className="flex-none gap-2 text-white">
            <p> Welcome, {user.firstName}</p>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="photoUrl" src={user.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connection">My Friends</Link>
                </li>
                <li>
                  <Link to="/requests">Friend Request</Link>
                </li>
                <li>
                  <Link to="/premium">Premium</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
