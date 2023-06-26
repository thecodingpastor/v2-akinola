import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../fetchConfig/api/axios";
import { AddAlertMessage } from "../UI/UISlice";

const defaultMessage = "Something went wrong. Please try again.";

export const Login = createAsyncThunk(
  "auth/Login",
  async (body: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login", body);
      dispatch(
        AddAlertMessage({ message: "Logged in successfully", type: "success" })
      );

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message: err.response.data.message || defaultMessage,
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const ForgotPassword = createAsyncThunk(
  "auth/ForgotPassword",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`/auth/password`, data);
      dispatch(
        AddAlertMessage({
          message:
            "If you have an account with us, a message has been sent to your registered email address for further instructions.",
          type: "success",
        })
      );

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message: defaultMessage,
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const ResetPassword = createAsyncThunk(
  "auth/ResetPassword",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch("/auth/password", data);
      dispatch(
        AddAlertMessage({
          message: "Password changed successfully.",
          type: "success",
        })
      );

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message:
            err.response.data.message || err.response.data || defaultMessage,
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const LogOut = createAsyncThunk(
  "auth/LogOut",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/logout");
      dispatch(
        AddAlertMessage({ message: "Logged out successfully", type: "success" })
      );

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message: err.response.data.message || defaultMessage,
        })
      );
      return rejectWithValue(err);
    }
  }
);
