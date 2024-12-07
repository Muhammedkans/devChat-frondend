import {createSlice } from "@reduxjs/toolkit";


const feedSlice = createSlice({
  name:"feed",
  initialState:null,
  reducers:{
    addFeed:(state,action)=>{
      console.log(action.payload);
      return action.payload;
    },
    removeUser:()=>{
      return null;
    },
  }
});

export default feedSlice.reducer;

export const {addFeed, removeUser} = feedSlice.actions;