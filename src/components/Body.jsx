import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { API_URL } from '../utils/constant.js'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice.js'
import { useSelector } from 'react-redux'
const Body = () => {
      
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store)=> store.user)
  const fetchUser = async ()=>{
   try{
    if(userData) return
    const res = await axios.get(API_URL+ "/profile/view",{withCredentials:true});
    
    
    dispatch(addUser(res?.data));
    
    
   }catch(err){
    if(err.status === 401){
     return navigate("/login");
      
    }
    
   
   }
    
  }
  useEffect(()=>{
  
    fetchUser();
   
  },[])
  return (

    <div>


      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default Body