import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

import {
  CreateProject,
  GetAllProjects,
  DeleteProject,
  UpdateProject,
} from "./projectApi";
import { InitialProjectStateType } from "./type";

const ProjectExtraReducers = (
  builder: ActionReducerMapBuilder<InitialProjectStateType>
) => {
  // ============= GetAllProjects ======================
  builder.addCase(GetAllProjects.pending, (state) => {
    state.projectLoading = "default";
  });
  builder.addCase(GetAllProjects.rejected, (state) => {
    state.projectLoading = null;
  });
  builder.addCase(GetAllProjects.fulfilled, (state, action) => {
    state.projectLoading = null;
    state.projects = action.payload;
  });

  // ============= CreateProject ======================
  builder.addCase(CreateProject.pending, (state) => {
    state.projectLoading = "default";
  });
  builder.addCase(CreateProject.rejected, (state) => {
    state.projectLoading = null;
  });
  builder.addCase(CreateProject.fulfilled, (state, action) => {
    state.projectLoading = null;
    state.projects.unshift(action.payload);
  });
  // ============= UpdateProject ======================
  builder.addCase(UpdateProject.pending, (state) => {
    state.projectLoading = "default";
  });
  builder.addCase(UpdateProject.rejected, (state) => {
    state.projectLoading = null;
  });
  builder.addCase(UpdateProject.fulfilled, (state, action) => {
    state.projectLoading = null;
    state.currentProject = action.payload;
    state.projects = state.projects
      ? state.projects.map((p) =>
          p._id === action.payload._id ? action.payload : p
        )
      : [];
  });
  // ============= DeleteProject ======================
  builder.addCase(DeleteProject.pending, (state) => {
    state.projectLoading = "Delete Project";
  });
  builder.addCase(DeleteProject.rejected, (state) => {
    state.projectLoading = "";
  });
  builder.addCase(DeleteProject.fulfilled, (state, action) => {
    state.projectLoading = "";
    state.projects = state.projects.filter((p) => action.meta.arg !== p.slug);
  });
};

export default ProjectExtraReducers;
