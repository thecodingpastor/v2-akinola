import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(401).json({ message: "invalid request." });

  try {
    await connectDB();
    const sliderData = await BlogPost.find({ isSlider: true }).select(
      "slug title images intro"
    );
    if (sliderData.length === 0) return res.json({ sliderData: [] });
    res.json(sliderData);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
