import { createSlice } from "@reduxjs/toolkit";

import authExtraReducers from "./authExtraReducers";
import { InitialAuthStateType } from "./types";
import { RootState } from "../../fetchConfig/store";

const initialState: InitialAuthStateType = {
  name: null,
  userId: null,
  accessToken: null,
  userLoading: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetCredentials: (state, action) => {
      const { name, accessToken, userId } = action.payload;
      state.name = name;
      state.accessToken = accessToken;
      state.userId = userId;
    },
  },
  extraReducers: authExtraReducers,
});

export const { SetCredentials } = AuthSlice.actions;

export const SelectAuth = (state: RootState) => state.auth;

export default AuthSlice.reducer;
