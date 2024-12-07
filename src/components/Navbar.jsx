import axios from "axios";
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {

  const user = useSelector(store => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleLogout =async  ()=>{
    await axios.post( BASE_URL+"/logout",{},{withCredentials:true});
    dispatch(removeUser());
    navigate("/login");
  }
  return (
    <div>
      
    <div className="text-center">
    <button className="bg-blue-500 text-white px-4 py-2 rounded">Centered Button</button>
</div>
    <div className="text-center"> 
      <button className="bg-red-500 px-3 py-4 mx-auto">click</button> 
    </div>
    
    <h1 className="text-3xl text-center font-bold bg-red-500 text-white px-5 py-5"> hahahhhahahh </h1>
    <div className="navbar bg-base-info">
    <div className="flex-1">
    <Link to="/" className="btn btn-ghost text-xl">daisyUI </Link>
  </div>
  {user && (<div className="flex-none gap-2">
     <p> Welcome , {user.firstName}</p>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <Link to="/profile" className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><Link to="/connection"> My Friends</Link></li>
        <li><Link to="/requests"> Friend Request</Link></li>
        <li><a onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>
  </div> )}
</div>
    </div>
  )
}

export default Navbar