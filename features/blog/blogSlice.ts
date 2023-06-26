import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import BlogExtraReducers from "./blogExtraReducers";
import { RootState } from "../../fetchConfig/store";
import { InitialBlogStateType, BlogPostType } from "./types";

const prevBlog =
  (typeof window !== "undefined" &&
    // @ts-ignore
    JSON.parse(localStorage.getItem("akin_draft_blog"))) ||
  null;

const initialState: InitialBlogStateType = {
  blogPosts: null,
  sliderData: null,
  blogLoading: null,
  currentBlog: null,
  relatedPosts: [],
  totalItemsCount: 0,
  page: 1,
  oldPage: 1,
  totalPages: 1,
  itemsPerPage: null,
  draftBlog: {
    title: prevBlog?.title || "",
    estimatedReadTime: prevBlog?.estimatedReadTime || "",
    intro: prevBlog?.intro || "",
    mainContent: prevBlog?.mainContent || "",
    images: prevBlog?.images || [],
    tags: prevBlog?.tags || [],
  },
};

export const BlogSlice = createSlice({
  name: "blogPost",
  initialState,
  reducers: {
    SetCurrentBlog: (state, action) => {
      state.currentBlog = action.payload;
    },
    GetCurrentBlog: (state, action: PayloadAction<string>) => {
      if (state.blogPosts !== null) {
        state.currentBlog =
          state.blogPosts.find(
            (p) => p.slug === action.payload || p._id === action.payload
          ) || null;
      }
    },
    SetDraftBlog: (state, action: PayloadAction<BlogPostType | null>) => {
      state.draftBlog = action.payload;
    },
    SetTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    SetPage: (state, action) => {
      state.page = action.payload;
    },
    SetTotalItemsCount: (state, action) => {
      state.totalItemsCount = action.payload;
    },
    SetOldPage: (state, action) => {
      state.oldPage = action.payload;
    },
  },
  extraReducers: BlogExtraReducers,
});

export const {
  SetDraftBlog,
  SetCurrentBlog,
  GetCurrentBlog,
  SetTotalItemsCount,
  SetTotalPages,
  SetOldPage,
  SetPage,
} = BlogSlice.actions;

export const SelectBlog = (state: RootState) => state.blogPost;
export default BlogSlice.reducer;
