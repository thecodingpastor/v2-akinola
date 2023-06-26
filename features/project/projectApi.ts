import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddAlertMessage } from "../UI/UISlice";
import { AxiosInstance } from "axios";
import axios from "../../fetchConfig/api/axios";

const defaultErrorMessage = "Something went wrong, please try again later.";

export const GetAllProjects = createAsyncThunk(
  "project/GetAllProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/project/get");

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const GetSingleProjectFromBackend = createAsyncThunk(
  "project/GetSingleProjectFromBackend",
  async (slug: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/projects/" + slug);
      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message:
            err.response.data ||
            "Could not fetch project at this time. Please try later",
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const UpdateProject = createAsyncThunk(
  "project/UpdateProject",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch("/project/", data);
      dispatch(
        AddAlertMessage({
          message: "Project updated successfully",
          type: "success",
        })
      );
      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message:
            err.message ||
            "Could not edit project at this time. Please try later",
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const CreateProject = createAsyncThunk(
  "project/CreateProject",
  async (body: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/project/", body);

      dispatch(
        AddAlertMessage({
          message: "Project created successfully",
          type: "success",
        })
      );

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message: err.response.data || defaultErrorMessage,
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const DeleteProject = createAsyncThunk(
  "project/DeleteProject",
  async (slug: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete("/project?slug=" + slug);
      dispatch(
        AddAlertMessage({
          message: "Project deleted successfully",
          type: "success",
        })
      );

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message: err.response.data || defaultErrorMessage,
        })
      );
      return rejectWithValue(err);
    }
  }
);
