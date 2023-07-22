import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import Protect from "../../../middleware/protect";
import { deleteImageInCloud } from "../../../utils/cloudinary";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    method,
    query: { slug, fileId },
  } = req;

  if (method !== "DELETE")
    return res.status(401).json({ message: "Invalid request" });

  if (!fileId)
    return res
      .status(400)
      .json({ message: "Something is not right please try again." });

  try {
    await connectDB();

    const blog = await BlogPost.findOne({ slug });
    if (!blog) return res.status(400).json({ message: "Blog not found!" });

    const result = await deleteImageInCloud(fileId as string);

    if (result === null) {
      return res
        .status(500)
        .json({ message: "File already deleted or not found." });
    }

    const updatedImages = blog.images.filter(
      (img: any) => img.fileId !== fileId
    );

    blog.images = updatedImages;
    // @ts-ignore
    await blog.save({ new: true });

    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default Protect(handler);
