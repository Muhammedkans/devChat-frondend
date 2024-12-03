import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constant.js';


const Login = () => {


  const [emailId, setEmailId] = useState("mondric@gmail.com");
 
  const [password , setPassword] = useState("Mondric@123");
  
  const dispatch =useDispatch();

  const navigate = useNavigate()
  const handleLogin = async  () =>  {
  try {
    const res  = await axios.post(BASE_URL+"/login", {emailId ,password,},{
      withCredentials:true
    });

    console.log(res.data);
    dispatch(addUser(res.data));
    navigate("/feed");
  }
  catch(err){
   console.error(err);
   setError(err?.response?.data);
  }
  }

 
  return (




    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="card w-96 shadow-xl bg-black">
      <div className="card-body text-white">
        <h2 className="card-title justify-center">Login</h2>


        <label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text text-white">Email ID</span>
    
  </div>
  <input type="text" value={emailId} onChange={(e)=> setEmailId(e.target.value)} className="input input-bordered w-full max-w-xs text-black" />
  
</label>


<label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text text-white">password</span>
    
  </div>
  <input type="text" value={password} onChange={(e)=> setPassword(e.target.value)} className="input input-bordered w-full max-w-xs text-black" />
  
</label>

        <div className="card-actions justify-center">
          <button className="btn btn-primary " onClick={handleLogin}>Log</button>
        </div>
      </div>
    </div>
  </div>
  
  ) 
}

export default Login