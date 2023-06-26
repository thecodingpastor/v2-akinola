import { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";

import {
  CreateBlog,
  DeleteBlog,
  DeleteBlogImageFromCloud,
  GetAllBlogPosts,
  GetRelatedBlogPosts,
  CreateBlogComment,
  GetSingleBlogFromBackend,
  PublishAndUnpublishBlog,
  UpdateBlog,
  DeleteBlogComment,
  ToggleBlogPostLike,
  SendMessage,
  ToggleSlider,
  GetSliderData,
  GetBlogCountAndHits,
} from "./blogApi";
import { InitialBlogStateType } from "./types";

const BlogExtraReducers = (
  builder: ActionReducerMapBuilder<InitialBlogStateType>
) => {
  // ============= GetAllBlogPosts ======================
  builder.addCase(GetAllBlogPosts.pending, (state) => {
    state.blogLoading = "default";
  });
  builder.addCase(GetAllBlogPosts.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(GetAllBlogPosts.fulfilled, (state, action) => {
    state.blogLoading = null;
    state.blogPosts = action.payload;
  });
  // ============= CreateBlog ======================
  builder.addCase(CreateBlog.pending, (state) => {
    state.blogLoading = "default";
  });
  builder.addCase(CreateBlog.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(CreateBlog.fulfilled, (state, action) => {
    state.blogLoading = null;
    state.blogPosts && state.blogPosts.unshift(action.payload);
  });

  // ============= UpdateBlog ======================
  builder.addCase(UpdateBlog.pending, (state) => {
    state.blogLoading = "default";
  });
  builder.addCase(UpdateBlog.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(UpdateBlog.fulfilled, (state, action) => {
    state.blogLoading = null;
    state.blogPosts =
      state.blogPosts &&
      state.blogPosts.map((blog) =>
        blog?._id === action.payload?._id ? action.payload : blog
      );
  });
  // ============= DeleteBlog ======================
  builder.addCase(DeleteBlog.pending, (state) => {
    state.blogLoading = "DeleteBlog";
  });
  builder.addCase(DeleteBlog.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(DeleteBlog.fulfilled, (state, action) => {
    state.blogLoading = null;
    state.blogPosts =
      state.blogPosts &&
      state.blogPosts.filter((blog) => blog?.slug !== action.meta.arg);
    state.currentBlog = null;
  });

  // ============= GetRelatedBlogPosts ======================
  builder.addCase(GetRelatedBlogPosts.pending, (state) => {
    state.blogLoading = "GetRelatedBlogPosts";
  });
  builder.addCase(GetRelatedBlogPosts.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(GetRelatedBlogPosts.fulfilled, (state, action) => {
    state.blogLoading = null;
    state.relatedPosts = action.payload;
  });
  // ============= GetSingleBlogFromBackend ======================
  builder.addCase(GetSingleBlogFromBackend.pending, (state) => {
    state.blogLoading = "default";
  });
  builder.addCase(GetSingleBlogFromBackend.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(GetSingleBlogFromBackend.fulfilled, (state, action) => {
    state.blogLoading = null;
    state.currentBlog = action.payload;
  });
  // ============= CreateBlogComment ======================
  // builder.addCase(CreateBlogComment.pending, (state) => {
  //   state.blogLoading = "create-comment";
  // });
  // builder.addCase(CreateBlogComment.rejected, (state) => {
  //   state.blogLoading = null;
  // });
  builder.addCase(CreateBlogComment.fulfilled, (state, action) => {
    // state.blogLoading = null;
    if (state.currentBlog) {
      state.currentBlog.comments.unshift(action.payload);
    }
  });
  // ============= DeleteBlogComment ======================
  builder.addCase(DeleteBlogComment.pending, (state) => {
    state.blogLoading = "delete-comment";
  });
  builder.addCase(DeleteBlogComment.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(DeleteBlogComment.fulfilled, (state, action) => {
    state.blogLoading = null;
    if (state.currentBlog) {
      state.currentBlog.comments = state.currentBlog.comments.filter(
        (comment) => comment?._id !== action.meta.arg.commentId
      );
    }
  });
  // ============= PublishAndUnpublishBlog ======================
  builder.addCase(PublishAndUnpublishBlog.pending, (state) => {
    state.blogLoading = "default";
  });
  builder.addCase(PublishAndUnpublishBlog.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(
    PublishAndUnpublishBlog.fulfilled,
    (state, action: PayloadAction<{ _id: string; isPublished: boolean }>) => {
      state.blogLoading = null;
      if (state.currentBlog) {
        state.currentBlog = {
          ...state.currentBlog,
          isPublished: action.payload.isPublished,
        };
      }
    }
  );
  // ============= ToggleBlogPostLike ======================
  builder.addCase(ToggleBlogPostLike.pending, (state) => {
    state.blogLoading = "like";
  });
  builder.addCase(ToggleBlogPostLike.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(ToggleBlogPostLike.fulfilled, (state, action) => {
    const { slug, author } = action.meta.arg;
    const { likes, newLikeAuthor } = action.payload;

    state.blogLoading = null;
    if (state.currentBlog) {
      state.currentBlog = {
        ...state.currentBlog,
        likes,
      };
    }
    if (state.blogPosts) {
      state.blogPosts = state.blogPosts.map((post) =>
        post.slug === slug ? { ...post, likes } : post
      );
      if (!author) localStorage.setItem("akinId", newLikeAuthor);
    }
  });
  //   // ============= DeleteImageFromCloud ======================
  builder.addCase(DeleteBlogImageFromCloud.pending, (state, action) => {
    state.blogLoading = "delete-image";
  });
  builder.addCase(DeleteBlogImageFromCloud.rejected, (state) => {
    state.blogLoading = null;
  });
  builder.addCase(DeleteBlogImageFromCloud.fulfilled, (state, action) => {
    state.blogLoading = null;
    if (state.blogPosts) {
      state.blogPosts =
        state.blogPosts.length > 0
          ? state.blogPosts.map((blog) =>
              blog.slug === action.meta.arg.slug ? { ...action.payload } : blog
            )
          : [];
    }
    state.currentBlog = action.payload;
  });
  //   // ============= SendMessage ======================
  builder.addCase(SendMessage.pending, (state) => {
    state.blogLoading = "message";
  });
  builder.addCase(SendMessage.rejected, (state) => {
    state.blogLoading = "";
  });
  builder.addCase(SendMessage.fulfilled, (state, action) => {
    state.blogLoading = "";
  });
  //   // ============= GetSliderData ======================
  builder.addCase(GetSliderData.pending, (state, action) => {
    state.blogLoading = "default";
  });
  builder.addCase(GetSliderData.rejected, (state) => {
    state.blogLoading = "";
  });
  builder.addCase(GetSliderData.fulfilled, (state, action) => {
    state.blogLoading = "";
    state.sliderData = action.payload;
  });
  //   // ============= GetBlogCountAndHits ======================
  builder.addCase(GetBlogCountAndHits.pending, (state, action) => {
    state.blogLoading = "default";
  });
  builder.addCase(GetBlogCountAndHits.rejected, (state) => {
    state.blogLoading = "";
  });
  builder.addCase(GetBlogCountAndHits.fulfilled, (state, action) => {
    const { totalItemsCount, totalPages, itemsPerPage } = action.payload;
    state.blogLoading = "";
    state.totalItemsCount = totalItemsCount;
    state.totalPages = totalPages;
    state.itemsPerPage = itemsPerPage;
  });
  //   // ============= ToggleSlider ======================
  builder.addCase(ToggleSlider.pending, (state, action) => {
    state.blogLoading = "Add To Slider";
  });
  builder.addCase(ToggleSlider.rejected, (state) => {
    state.blogLoading = "";
  });
  builder.addCase(ToggleSlider.fulfilled, (state, action) => {
    state.blogLoading = "";
    if (state.currentBlog) {
      state.currentBlog = {
        ...state.currentBlog,
        isSlider: !state.currentBlog?.isSlider,
      };
    }
  });
};

export default BlogExtraReducers;
