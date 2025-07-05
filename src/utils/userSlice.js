import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loaded: false,
  },
  reducers: {
    addUser: (state, action) => {
      return {
        user: action.payload,
        loaded: true,
      };
    },
    removeUser: () => ({
      user: null,
      loaded: false,
    }),
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;



