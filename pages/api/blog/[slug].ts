import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import applyRateLimit from "../../../utils/applyRateLimiting";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(401).json({ message: "Invalid request" });

  const { slug } = req.query;

  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    await connectDB();
    const blog = await BlogPost.findOne({ slug }).populate({
      path: "relatedPosts",
      select: "title intro images slug",
    });

    if (!blog) return res.json({ message: "Blog not found" });
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
