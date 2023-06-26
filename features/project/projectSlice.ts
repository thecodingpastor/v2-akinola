import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialProjectStateType, ProjectType } from "./type";
import ProjectExtraReducers from "./projectExtraReducers";
import { RootState } from "../../fetchConfig/store";

const initialState: InitialProjectStateType = {
  projects: [],
  projectLoading: null,
  currentProject: null,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    GetCurrentProject: (state, action: PayloadAction<string>) => {
      if (state.projects.length > 0) {
        state.currentProject =
          state.projects.find(
            (p) => p.slug === action.payload || p._id === action.payload
          ) || null;
      }
    },
    SetCurrentProject: (state, action: PayloadAction<ProjectType | null>) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: ProjectExtraReducers,
});

export const { GetCurrentProject, SetCurrentProject } = projectSlice.actions;

export const SelectProject = (state: RootState) => state.project;
export default projectSlice.reducer;
