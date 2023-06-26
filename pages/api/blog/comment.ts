import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import fetchGoogleScore from "../../../utils/fetchGoogleScore";
import User from "../../../models/userModel";
import applyRateLimitShort from "../../../utils/applyRateLimitingShort";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      await applyRateLimitShort(req, res);
    } catch {
      return res.status(429).json({ message: "Too many requests" });
    }

    const { author, text, gReCaptchaToken, slug } = req.body;

    if (!gReCaptchaToken)
      return res.status(401).json({
        message: "Unexpected error",
      });

    try {
      const reCaptchaRes = await fetchGoogleScore(gReCaptchaToken);

      if (!reCaptchaRes)
        return res.status(401).json({
          message: "Unexpected error",
        });

      await connectDB();
      const blog = await BlogPost.findOneAndUpdate(
        { slug },
        { $push: { comments: { author, text } } },
        { new: true }
      );
      res.json(blog.comments[blog.comments.length - 1]);
    } catch (err: any) {
      return res.status(500).json({
        message: err.message || "Could not create comment. Please try later",
      });
    }
  } else if (req.method === "DELETE") {
    const { slug, commentId, userId } = req.query;

    if (!slug || !commentId || !userId)
      return res.status(401).json({ message: "Invalid parameters!" });

    const checkUser = await User.findById(userId);
    if (!checkUser)
      return res
        .status(401)
        .json({ message: "You are not permitted to do that!" });

    try {
      await connectDB();
      const blog = await BlogPost.findOneAndUpdate(
        { slug },
        { $pull: { comments: { _id: commentId } } }
      );

      if (!blog)
        return res
          .status(400)
          .json({ message: "That blog cound not be found." });

      return res.json("ok");
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "Invalid request" });
  }
};

export default handler;
