import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { API_URL } from '../utils/constant'

const Premium = () => {


const [isUserPremium, setIsUserPremium] =useState(false);


 useEffect(()=> {
  verifyPremiumUser();
 },[])

  const verifyPremiumUser = async () => {
     const res = await axios.get(API_URL + "/premium/verify",{withCredentials:true,});

     if(res.data.isPremium){
      setIsUserPremium(true);
     }
  }

  const handlePayClick = async(type)=>{
 const order = await axios.post(
  API_URL+ "/payment/create",
  {membershipType:type},
  {withCredentials:true}
 )

 const {amount , currency , notes , orderId, keyId} = order.data
 const options = {
  key: keyId, // Replace with your Razorpay key_id
  amount:amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: currency,
  name: 'DevChat',
  description: 'Connect to other developers',
  order_id:orderId, // This is the order_id created in the backend
 
  prefill: {
    name: notes.firstName + "" + notes.lastName,
    email: notes.emailId,
    contact: '9999999999'
  },
  theme: {
    color: '#F37254'
  },
  handler: verifyPremiumUser,
};

 const rzp = new window.Razorpay(options);
 rzp.open();
  }
  return isUserPremium ? <div>you are already a premium user</div> :(
    <div className="flex w-10/12 mx-auto flex-col lg:flex-row my-20 ">
  <div className="card bg-[#C0C0C0] text-white font-semibold text-3xl p-4 rounded-box grid h-80 flex-grow place-items-center"><h1>Silver Membership</h1>

  <ul className='font-medium text-lg'>
    
    <li> - chat with other people</li> 
    <li> - 100 connection per day</li> 
    <li> - 3 months</li> 
    <li> - Blue tick </li> 
  </ul>
  <button onClick={()=>handlePayClick("silver")} className='text-lg py-2 px-4 border bg-secondary rounded-lg'>PayNow</button>
  </div>

  <div className="divider lg:divider-horizontal font-semibold text-1xl">OR</div>
  <div className="card bg-[#FFD700] text-black font-semibold text-3xl p-4 rounded-box grid h-80 flex-grow place-items-center"> <h1>Gold MemberShip</h1> 


  <ul className='font-medium text-lg '>
    
    <li> -   chat with other people</li> 
    <li> - 1000 connection per day</li> 
    <li> - 6 months</li> 
    <li> - Blue tick </li> 
  </ul>
  <button onClick={() =>handlePayClick("gold")} className='text-lg py-2 px-4 border bg-primary rounded-lg' >PayNow</button>
  </div>

  
</div>
  )
}

export default Premium