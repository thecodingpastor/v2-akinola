import { Schema, model, models } from "mongoose";

const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      minlength: [5, "Title cannot be less than 5 characters"],
      trim: true,
    },
    slug: {
      type: String,
      unique: [true, "Tweak the title a bit, title already in use"],
    },
    intro: {
      type: String,
      trim: true,
      minlength: [
        100,
        "Description cannot have less than 100 valid characters",
      ],
      maxlength: [
        200,
        "Description cannot have more than 200 valid characters",
      ],
    },
    estimatedReadTime: {
      type: String,
      required: [true, "Estimated read time is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isSlider: {
      type: Boolean,
      default: false,
    },
    images: [
      {
        fileId: String,
        url: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    relatedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: "BlogPost",
      },
    ],
    mainContent: {
      type: String,
      trim: true,
      minlength: [100, "Content cannot be less than 100 characters"],
    },
    comments: [
      {
        author: {
          type: String,
          trim: true,
          minlength: [3, "Author cannot be less than 3 characters."],
          maxlength: [50, "Author cannot be more than 50 characters."],
        },
        text: {
          type: String,
          trim: true,
          minlength: [5, "Comments cannot be less than 5 characters."],
          maxlength: [1000, "Comments cannot be more than 1000 characters."],
        },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    likes: [String], //The strings are the random numbers generated and stored in the local storage,
  },
  { timestamps: true }
);

// const Blog = model<BlogInterface>("Blog", BlogSchema);
const BlogPost = models.BlogPost || (model("BlogPost", BlogPostSchema) as any); //any is incorrect,

export default BlogPost;
