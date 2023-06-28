import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { InitialAuthStateType } from "./types";

import { Login, LogOut, ForgotPassword, ResetPassword } from "./authApi";

const authExtraReducers = (
  builder: ActionReducerMapBuilder<InitialAuthStateType>
) => {
  // =============LOGIN ======================
  builder.addCase(Login.pending, (state) => {
    state.userLoading = true;
  });
  builder.addCase(Login.rejected, (state) => {
    state.userLoading = false;
  });
  builder.addCase(Login.fulfilled, (state, action) => {
    state.userLoading = false;
    state.accessToken = action.payload.accessToken;
    state.userId = action.payload.userId;
  });
  // ==================LOGOUT ========================
  builder.addCase(LogOut.pending, (state) => {
    state.userLoading = true;
  });
  builder.addCase(LogOut.rejected, (state) => {
    // Handling error pending
    state.userLoading = false;
  });
  builder.addCase(LogOut.fulfilled, (state) => {
    state.userLoading = null;
    state.accessToken = null;
    state.userId = null;
    window.location.href = "/";
  });

  // // =============ForgotPassword ======================
  // builder.addCase(ForgotPassword.pending, (state) => {
  //   state.userLoading = true;
  // });
  // builder.addCase(ForgotPassword.rejected, (state) => {
  //   state.userLoading = null;
  // });
  // builder.addCase(ForgotPassword.fulfilled, (state) => {
  //   state.userLoading = null;
  // });
  // // =============ResetPassword ======================
  // builder.addCase(ResetPassword.pending, (state) => {
  //   state.userLoading = "reset";
  // });
  // builder.addCase(ResetPassword.rejected, (state) => {
  //   state.userLoading = null;
  // });
  // builder.addCase(ResetPassword.fulfilled, (state) => {
  //   state.userLoading = null;
  // });
};

export default authExtraReducers;
