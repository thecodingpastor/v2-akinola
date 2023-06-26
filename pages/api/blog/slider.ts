import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import Protect from "../../../middleware/protect";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PATCH")
    return res.status(401).json({ message: "Invalid request" });
  const { slug, isSlider } = req.body;
  if (!slug) return res.status(404).json({ message: "Invalid parameters" });

  try {
    await connectDB();

    await BlogPost.findOneAndUpdate({ slug }, { isSlider: !isSlider });

    res.json("ok");
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default Protect(handler);
