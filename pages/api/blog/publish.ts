import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import Protect from "../../../middleware/protect";
import User from "../../../models/userModel";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT")
    return res.status(401).json({ message: "Invalid request" });
  const { slug, isPublished } = req.body;
  if (!slug) return res.status(404).json({ message: "Invalid parameters" });

  try {
    await connectDB();

    const blog = await BlogPost.findOneAndUpdate(
      { slug },
      { isPublished: !isPublished },
      { new: true }
    );

    if (!blog)
      return res.status(404).json({ message: `The blog could not be found` });

    await User.findOneAndUpdate(
      {
        email: process.env.EMAIL_USER,
      },
      { $inc: { publishedBlogPost: blog.isPublished ? 1 : -1 } }
    );

    res.json({ _id: blog._id, isPublished: blog.isPublished });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default Protect(handler);
