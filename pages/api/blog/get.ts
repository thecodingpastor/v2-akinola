import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import User from "../../../models/userModel";
import applyRateLimit from "../../../utils/applyRateLimiting";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await applyRateLimit(req, res);
    } catch {
      return res.status(429).json({ message: "Too many requests" });
    }
    const { userId, page } = req.query;
    const limit = 20;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * limit;

    try {
      let user: any;

      await connectDB();
      if (userId) {
        user = await User.findById(userId);
      }

      const blogs = await BlogPost.find(user?._id ? {} : { isPublished: true })
        .sort("-createdAt")
        .select("-mainContent -isSlider -relatedPosts")
        .skip(skip)
        .limit(limit);

      if (!blogs)
        return res
          .status(500)
          .json({ message: "Could not fetch blogs at this time" });

      res.json(blogs);
    } catch (err: any) {
      return res.status(500).json({
        message: err.message || "Could not fetch blogs. Please try later",
      });
    }
  } else {
    return res.status(401).json({ message: "Invalid request" });
  }
};

export default handler;
