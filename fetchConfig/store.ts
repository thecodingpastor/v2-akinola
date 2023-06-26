import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import UIREducer from "../features/UI/UISlice";
import AuthReducer from "../features/auth/authSlice";
import BlogReducer from "../features/blog/blogSlice";
import ProjectReducer from "../features/project/projectSlice";

export const store = configureStore({
  reducer: {
    UI: UIREducer,
    auth: AuthReducer,
    blogPost: BlogReducer,
    project: ProjectReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export const BlurImageUrl =
  "https://res.cloudinary.com/indelible-success/image/upload/v1687537144/akinola/loading-removebg-preview_y3jn5v.png";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
