import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import Protect from "../../../middleware/protect";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(401).json({ message: "Invalid request" });
  const { searchTerm, currentBlogSlug } = req.query;

  if ((searchTerm as string).trim()?.length < 5 || !currentBlogSlug)
    return res.status(404).json({ message: "Invalid parameters" });

  try {
    await connectDB();

    const blogs = await BlogPost.find({
      title: { $regex: searchTerm, $options: "i" },
      slug: { $ne: currentBlogSlug },
      isPublished: true,
    })
      .select("title")
      .limit(5);

    if (!blogs)
      return res
        .status(404)
        .json({ message: `Something went wrong with the search` });

    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default Protect(handler);
