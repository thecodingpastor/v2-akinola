import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import crypto from "crypto";
import applyRateLimitShort from "../../../utils/applyRateLimitingShort";
import fetchGoogleScore from "../../../utils/fetchGoogleScore";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(401).json({ message: "Invalid request" });

  try {
    await applyRateLimitShort(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }

  const { author, slug, gReCaptchaToken } = req.body;
  let updatedBlog, newLikeAuthor;

  if (!gReCaptchaToken)
    return res.status(401).json({ message: "Unexpected error!" });

  try {
    const reCaptchaRes = await fetchGoogleScore(gReCaptchaToken);

    if (!reCaptchaRes)
      return res.status(401).json({ message: "Unexpected error" });

    await connectDB();
    const blog = await BlogPost.findOne({ slug });
    if (!blog)
      return res
        .status(400)
        .json({ message: "The blog post could not be found." });
    if (author) {
      if (!blog.likes.find((p: string) => p === author)) {
        // Then add like
        blog.likes.push(author);
        updatedBlog = await blog.save({ new: true });
      } else {
        // remove like
        blog.likes.pull(author);
        updatedBlog = await blog.save({ new: true });
      }
    } else {
      // generate new author id
      newLikeAuthor = crypto.randomBytes(16).toString("hex");
      // Then add like
      blog.likes.push(newLikeAuthor);
      updatedBlog = await blog.save({ new: true });
    }

    res.json({ likes: updatedBlog.likes, newLikeAuthor });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Something went wrong. Please try later",
    });
  }
};

export default handler;
