import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddAlertMessage } from "../UI/UISlice";
import axios from "../../fetchConfig/api/axios";

const defaultErrorMessage = "Something went wrong, please try again later.";

export const GetAllBlogPosts = createAsyncThunk(
  "blog/GetAllBlogPosts",
  async (
    { userId, page }: { userId: string; page: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = userId
        ? await axios.get(`/blog/get?userId=${userId}&page=${page}`)
        : await axios.get("/blog/get?page=" + page);

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

export const CreateBlog = createAsyncThunk(
  "blog/CreateBlog",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/blog", data);
      dispatch(
        AddAlertMessage({
          message: "Blog Post created successfully.",
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

export const UpdateBlog = createAsyncThunk(
  "blog/UpdateBlog",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch("/blog", data);
      dispatch(
        AddAlertMessage({
          message: "Blog updated successfully",
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

export const DeleteBlog = createAsyncThunk(
  "blog/DeleteBlog",
  async (slug: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete("/blog?slug=" + slug);
      dispatch(
        AddAlertMessage({
          message: "Blog deleted",
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

export const GetRelatedBlogPosts = createAsyncThunk(
  "blog/GetRelatedBlogPosts",
  async (
    {
      searchTerm,
      currentBlogSlug,
    }: { searchTerm: string; currentBlogSlug: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/blog/related-posts?searchTerm=${searchTerm}&currentBlogSlug=${currentBlogSlug}`
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

export const GetSingleBlogFromBackend = createAsyncThunk(
  "blog/GetSingleBlogFromBackend",
  async (slug: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/blog/" + slug);
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

export const CreateBlogComment = createAsyncThunk(
  "blog/CreateBlogComment",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/blog/comment", data);
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

export const DeleteBlogComment = createAsyncThunk(
  "blog/DeleteBlogComment",
  async ({ userId, commentId, slug }: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/blog/comment?userId=${userId}&commentId=${commentId}&slug=${slug}`
      );
      dispatch(
        AddAlertMessage({
          message: "Comment deleted",
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

export const PublishAndUnpublishBlog = createAsyncThunk(
  "blog/PublishAndUnpublishBlog",
  async (
    { slug, isPublished }: { slug: string; isPublished: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.put("/blog/publish", {
        slug,
        isPublished,
      });

      dispatch(
        AddAlertMessage({
          message: response.data.isPublished
            ? "Blog published successfully"
            : "Blog will no longer appear to the public",
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

export const DeleteBlogImageFromCloud = createAsyncThunk(
  "blog/DeleteBlogImageFromCloud",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/blog/delete-image?slug=${data.slug}&fileId=${data.fileId}`
      );
      dispatch(
        AddAlertMessage({
          message: "Image deleted successfully",
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

export const ToggleBlogPostLike = createAsyncThunk(
  "blog/ToggleBlogPostLike",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/blog/like", data);
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

export const ToggleSlider = createAsyncThunk(
  "blog/ToggleSlider",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.patch("/blog/slider", data);
      dispatch(
        AddAlertMessage({
          message: data.isSlider
            ? "Post will NO LONGER APPEAR in the slider"
            : "Post will NOW APPEAR in the slider",
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

export const GetSliderData = createAsyncThunk(
  "blog/GetSliderData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get("/blog/get-slider");

      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message:
            "Could not fetch the slide show data at this point, please try later",
        })
      );
      return rejectWithValue(err);
    }
  }
);

export const IncreaseBlogView = createAsyncThunk(
  "blog/IncreaseBlogView",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get("/blog/increase-view?slug=" + slug);

      return response.data;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const GetBlogCountAndHits = createAsyncThunk(
  "blog/GetBlogCountAndHits",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/blog/count");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
);

export const SendMessage = createAsyncThunk(
  "blog/SendMessage",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/email", data);
      return response.data;
    } catch (err: any) {
      dispatch(
        AddAlertMessage({
          message:
            "Message could not be sent at this time. Please try again later.",
        })
      );
      return rejectWithValue(err);
    }
  }
);
