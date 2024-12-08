import axios from 'axios';
import React from 'react'
import { BASE_URL } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../utils/feedSlice';


const UserData = ({user}) => {
   const { _id , photoUrl,firstName,lastName,about,age,gender} = user;
    const dispatch = useDispatch();
  const handleSendRequest = async (status, userId)=>{
    
    try{
      const res = await axios.post(BASE_URL+ `/request/send/${status}/${userId}`,{},{withCredentials:true});

      dispatch(removeFeed(userId));
    }
    catch(err){
      console.log(err);
    }
   
    
    
  }


  return (
    <div className='flex justify-center'>
    <div className="card bg-base-300 w-96 shadow-xl ">
  <figure>
    <img
      src={photoUrl}
      alt="photo" />
  </figure>
  <div className="card-body">
    <h2 className="card-title"></h2>
    <h2 className="card-title">{firstName + " " + lastName}</h2>
    {age && gender && <p>{age + "" + gender}</p> }
    <p>{about}</p>
    <div className="card-actions justify-center my-4">
      <button className="btn btn-primary" onClick={()=> handleSendRequest("ignore",_id)} >Ignore</button>
      <button className="btn btn-secondary" onClick={()=>handleSendRequest("interested",_id)}>Interested</button>
    </div>
  </div>
</div>
</div>
  )
}

export default UserData;