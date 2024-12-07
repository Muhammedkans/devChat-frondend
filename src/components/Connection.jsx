import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constant'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addConnection } from '../utils/connectionSlice'

const Connection = () => {
  const connections = useSelector((store)=>store.connections);
const dispatch = useDispatch();
  const fetchConnections = async()=>{
    try{
      const res =await axios.get(BASE_URL + "/user/connection",{withCredentials:true});

      dispatch(addConnection(res?.data?.data));
      console.log(res?.data?.data);
    }catch(err){

    }

  }

  useEffect(()=>{
    fetchConnections();
  },[]);

  if(!connections) return 

  if(connections.length === 0){
    return <div className='text-center text-bold text-2xl'>No Users found</div>;
  }
  return (
    <div className='text-center my-10'>
         

         <h1 className='font-bold text-3xl'>My Friends</h1>
         
        

        {connections.map((connection)=> {
          const {firstName,lastName,_id, photoUrl,age,gender,about} = connection
         return  (<div key={_id}className='text-black m-4 p-4 bg-base-300 flex w-1/2 mx-auto'>
                  <div> <img   className='w-20 h-20 rounded-full '  src={photoUrl}/> 
                  
                  </div>

                  <div className='text-left mx-4'>
                  
                  <h2 className='font-bold '>{firstName} {lastName}</h2>
                  <p>{about}</p>
                 </div>
                  </div>)
          })}
    </div>
  )
}

export default Connection