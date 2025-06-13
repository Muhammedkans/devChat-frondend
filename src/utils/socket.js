import { io } from "socket.io-client";
import API from "../api";

export const createSocketConnection = () => {
  return io(API);
};