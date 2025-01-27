import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import  {createSocketConnection}  from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../utils/constant';

const Chat = () => {
   const [newMessage, setNewMessage] = useState("")
   const [messages , setMessages ] = useState([])
   const {targetUserId} = useParams();
   console.log(targetUserId);

   const user = useSelector((store) => store.user)
   const userId = user?._id;


   const fetchChatMessage = async () => {
       const chat = await  axios.get(API_URL + "/chat/" + targetUserId, {withCredentials:true});


       console.log(chat.data.messages);
       const chatMessage = chat?.data?.messages.map((msg)=>{
            const {senderId , text} = msg;
           console.log(msg);
            return {
              firstName:senderId?.firstName,
              lastName:senderId?.lastName,
              text,
            }
       })


       setMessages(chatMessage);
   }

   useEffect(()=>{
    fetchChatMessage();
   },[]);

  
   
   useEffect(() => {
     if (!userId) { return }
     const socket = createSocketConnection();
    
     socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });

     socket.on("messageReceived", ({ firstName, lastName, text }) => {
       console.log(firstName + ":" + text);
       setMessages((messages) => [...messages, { firstName, lastName, text }]);
     });

     return () => {
       socket.disconnect();
     }
   }, [userId, targetUserId]);

   const sendMessage = () => {
     const socket = createSocketConnection();

     socket.emit("sendMessage", {
       firstName: user?.firstName,
       lastName: user?.lastName,
       userId,
       targetUserId,
       text: newMessage,
     });
     setNewMessage("")
   }

   return (
     <div className='w-2/4 border border-gray-400 m-4 h-auto'>
       <div className='w-full overflow-y-auto'> 
         <h2 className='text-xl font-extrabold text-secondary mx-auto p-5 border-b border-gray-400 text-center'>
           Chat
         </h2>
    
         {messages?.map((msg, index) => {
           return (
            <div
            key={index}
            className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"} h-40`}
          >
               <div className="chat-image avatar">
                 <div className="w-10 rounded-full">
                   <img
                     alt="Tailwind CSS chat bubble component"
                     src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                 </div>
               </div>
               <div className="chat-header">
                 {`${msg?.firstName} ${msg?.lastName}`}
                 <time className="text-xs opacity-50">12:45</time>
               </div>
               <div className="chat-bubble">{msg?.text}</div>
               <div className="chat-footer opacity-50">Delivered</div>
             </div>
           );
         })}
         
         <div className='p-5 border-t border-gray-400 flex justify-between items-center'>
           <input 
             value={newMessage} 
             onChange={(e) => setNewMessage(e.target.value)} 
             type="text" 
             className='border-3 justify-center flex-1 p-2'  
           />
           <button onClick={sendMessage} className='bg-secondary p-4'>Send</button>
         </div>
       </div>
     </div>
   );
}

export default Chat;
