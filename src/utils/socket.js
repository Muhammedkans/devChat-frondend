import { io } from "socket.io-client";
import { API_URL } from "./constant";

export const createSocketConnection = () => {
  return io(API_URL, {
    withCredentials: true,  
   
  });
};