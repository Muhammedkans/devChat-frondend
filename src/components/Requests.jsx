import axios from 'axios'
import React, { useEffect } from 'react'
import { API_URL } from '../utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { addRequests, removeRequests } from '../utils/requestSlice'


const Requests = () => {
  const dispatch = useDispatch();

  const requestConnection = useSelector((store)=> store.requests)
   console.log(requestConnection)
  const revieRequest = async(status, _id)=>{
     try{
      const res = await axios.post(API_URL+  "/request/review/" +  status + "/" + _id,{},{withCredentials:true});

      dispatch(removeRequests(_id));
      console.log(requestConnection);
     }catch(err){

     }
  }

  const requestFetch = async()=>{
    try{
      const res = await axios.get(BASE_URL + "/request/review/recieved",{withCredentials:true});
    dispatch(addRequests(res?.data.data))
    console.log(res.data.data);
    }catch(err){
      console.log(err.response.data)
    }
    
  }

  useEffect(()=>{
   requestFetch();
  },[]);

   if(!requestConnection) return 

   
  if(requestConnection.length === 0){
    return <div className='text-center text-bold text-2xl'>No Users found</div>;
  } 
  return (
    <div className='text-center my-10'>
         

         <h1 className='font-bold text-3xl'>My Friends</h1>
         
        

        {requestConnection.filter((request)=> request.fromUserId && request._id ).map((requests)=> {
          const {firstName,lastName,_id, photoUrl,age,gender,about} = requests.fromUserId;
         return  (<div key={_id}className='flex justify-between items-center text-black m-4 p-4 bg-base-300 flex w-1/2 mx-auto '>
                  <div className=''> <img   className='w-20 h-20 rounded-full '  src={photoUrl}/> 
                  
                  </div>

                  <div className='text-left mx-4'>
                  
                  <h2 className='font-bold '>{firstName} {lastName}</h2>
                  <p>{about}</p>
                 </div>
                    <div > 

                    <button className="btn btn-primary mx-2" onClick={()=>revieRequest("rejected",requests._id)}>Reject</button>
                    <button className="btn btn-secondary mx-2" onClick={()=>revieRequest("accepted",requests._id)}>Accept</button>
                    </div>
                  </div>)
          })}
    </div>
  )
}
  


export default Requests