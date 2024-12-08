import {createSlice } from "@reduxjs/toolkit";


const feedSlice = createSlice({
  name:"feed",
  initialState:null,
  reducers:{
    addFeed:(state,action)=>{
      console.log(action.payload);
      return action.payload;
    },
    removeFeed:(state,action)=>{
       const newFeed = state.filter((feed) => feed._id !== action.payload);
       return newFeed;
    },
  }
});

export default feedSlice.reducer;

export const {addFeed, removeFeed} = feedSlice.actions;