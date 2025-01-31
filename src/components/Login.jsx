import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice.js';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constant.js';


const Login = () => {


  const [emailId, setEmailId] = useState("mondric@gmail.com");
 
  const [password , setPassword] = useState("Mondric@123");

  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");

  const [lastName , setLastName]=  useState("");

  const [isLoginForm, setIsloginForm ]= useState(false);

  
  const dispatch =useDispatch();

  const navigate = useNavigate()
  const handleLogin = async  () =>  {
  try {
    const res  = await axios.post(API_URL+"/login", {emailId ,password,},{
      withCredentials:true
    });
    console.log(API_URL);
    dispatch(addUser(res?.data));
    
    navigate("/");
  }
  catch(err){
   
   setError(err?.response?.data);
  }
  }

  const handleSignUp = async () =>{
    try{
      const res = await axios.post(API_URL+ "/signup", {firstName,lastName,emailId,password},{withCredentials:true});
      dispatch(addUser(res?.data?.data));

      return navigate("/profile")

    }catch(err){
      setError(err?.response?.data);
    }
    
  }

 
  return (




    <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="card w-96 shadow-xl bg-black">
      <div className="card-body text-white">
        <h2 className="card-title justify-center"> {isLoginForm ? "Login" : "Sign Up" }</h2>


      { !isLoginForm && (<div>
        <label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text text-white">First Name:</span>
    
  </div>
  <input type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} className="input input-bordered w-full max-w-xs text-black" />
  
</label>


<label className="form-control w-full max-w-xs">
  <div className="label">
    <span className="label-text text-white">Last Name:</span>
    
  </div>
  <input type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} className="input input-bordered w-full max-w-xs text-black" />
  
</label>

</div>)

      }





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
          <p className='text-red-700'>{error}</p>
        <div className="card-actions justify-center">
          <button className="btn btn-primary " onClick={isLoginForm ? handleLogin : handleSignUp}> {isLoginForm? "LogIn": "Sign Up"  } </button>
        </div>
        <p className='cursor-pointer m-auto' onClick={()=>setIsloginForm((value)=> !value)}> {isLoginForm? "New User ? Sign Up": "Existing User ? Login Here"} </p>
      </div>
    </div>
  </div>
  
  ) 
}

export default Login