import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import applyRateLimit from "../../../utils/applyRateLimiting";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await applyRateLimit(req, res);
    } catch {
      return res.status(429).json({ message: "Too many requests" });
    }

    try {
      await connectDB();

      const user = await User.findOneAndUpdate(
        {
          email: process.env.EMAIL_USER,
        },
        { $inc: { hits: 1 } },
        { new: true }
      );

      const { blogCount, publishedBlogCount, hits } = user;
      const totalItemsCount = !req.cookies.akinola
        ? publishedBlogCount
        : blogCount;
      const itemsPerPage = 3;

      res.json({
        totalItemsCount,
        totalPages: Math.ceil(totalItemsCount / itemsPerPage),
        hits,
        itemsPerPage,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: err.message || "Could not get blog count",
      });
    }
  } else {
    return res.status(401).json({ message: "Invalid request" });
  }
};

export default handler;
