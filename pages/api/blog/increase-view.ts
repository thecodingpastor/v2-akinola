import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import applyRateLimit from "../../../utils/applyRateLimiting";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(401).json({ message: "Invalid request." });
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }
  const { slug } = req.query;
  if (!slug) return res.status(401).json({ message: "Invalid parameters" });

  try {
    await connectDB();
    await BlogPost.findOneAndUpdate({ slug }, { $inc: { views: 1 } });

    res.json("ok");
  } catch (err: any) {
    return res.status(500).json({
      message:
        err.message || "Could not update blog post's view. Please try later",
    });
  }
};

export default handler;
