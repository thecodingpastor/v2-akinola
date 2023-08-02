import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import User from "../../../models/userModel";
import slugify from "../../../utils/slugify";
import cloudinary, { saveImageInCloud } from "../../../utils/cloudinary";
import Protect from "../../../middleware/protect";
import ValidateImages, { ImageType } from "../../../utils/validateImage";

export const config = { api: { bodyParser: { sizeLimit: "5mb" } } };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      title,
      mainContent,
      images,
      intro,
      relatedPosts,
      estimatedReadTime,
    } = req.body;

    if (relatedPosts.length > 3)
      return res
        .status(400)
        .json({ message: "Related posts should not be more than 3" });
    try {
      const imagesError: any[] = [];

      images.forEach((img: ImageType) => {
        imagesError.push(ValidateImages(img));
      });

      // It only gets here when a user is being malicious.
      if (imagesError.includes("error"))
        return res.status(400).json({
          message: `
          <ol>
            <li>1.) Invalid image or images detected.</li>
            <li>2.) Only PNG, JPEG, JPG allowed.</li>
            <li>3.) Max size 1MB.</li>
          </ol>
             `,
        });

      const pendingImageResults: any[] = [];

      images.forEach((img: ImageType) => {
        const imageUpload = saveImageInCloud(img?.url);
        pendingImageResults.push(imageUpload);
      });

      const imageResults = await Promise.all(pendingImageResults);

      await connectDB();

      const post = await BlogPost.create({
        title,
        mainContent,
        intro,
        estimatedReadTime,
        relatedPosts,
        images: imageResults,
        slug: slugify(title),
      });

      const newBlogPost = await BlogPost.findById(post._id).populate({
        path: "relatedPosts",
        select: "title intro images slug",
      });

      await User.findOneAndUpdate(
        { email: process.env.EMAIL_USER },
        { $inc: { blogCount: 1 } }
      );

      res.json(newBlogPost);
    } catch (err: any) {
      if (err.code === 11000)
        return res.status(400).json({
          message: `A blog with the title "${title}" already exists. Change the title and re-save.`,
        });

      return res.status(500).json({
        message: err.message || "Could not create blog. Please try later",
      });
    }
  } else if (req.method === "PATCH") {
    const {
      slug,
      title,
      mainContent,
      relatedPosts,
      images,
      intro,
      estimatedReadTime,
    } = req.body;

    if (relatedPosts.length > 3)
      return res
        .status(400)
        .json({ message: "Related posts should not be more than 3" });
    let newImages: any[] = [];
    if (images?.length > 0) {
      newImages = images.filter((img: any) => img.name);
    }
    const imagesError: any[] = [];
    newImages.forEach((img: ImageType) => {
      imagesError.push(ValidateImages(img));
    });
    // It only gets here when a user is being malicious.
    if (imagesError.includes("error"))
      return res.status(400).json({
        message: `
          <ol>
            <li>1.) Invalid image or images detected.</li>
            <li>2.) Only PNG, JPEG, JPG allowed.</li>
            <li>3.) Max size 1MB.</li>
          </ol>
             `,
      });
    try {
      await connectDB();
      const blog = await BlogPost.findOne({ slug });
      if (!blog) return res.status(404).json({ message: "Blog not found" });
      const pendingImageResults: any[] = [];
      if (newImages.length > 0) {
        newImages.forEach((img: ImageType) => {
          const imageUpload = saveImageInCloud(img?.url);
          pendingImageResults.push(imageUpload);
        });
      }
      const newImageResults = await Promise.all(pendingImageResults);
      const updatedBlog = await BlogPost.findOneAndUpdate(
        { slug },
        {
          title,
          mainContent,
          slug: slugify(title),
          intro,
          estimatedReadTime,
          relatedPosts,
          images: [
            ...images.filter((img: any) => img.fileId),
            ...newImageResults,
          ],
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedBlog)
        return res.status(400).json({ message: "Blog not found!" });

      res.json(updatedBlog);
    } catch (err: any) {
      return res.status(500).json({
        message: err.message || "Something went wrong. Please try later.",
      });
    }
  } else if (req.method === "DELETE") {
    const { slug } = req.query;

    try {
      await connectDB();
      const blog = await BlogPost.findOneAndDelete({ slug });
      if (!blog)
        return res
          .status(400)
          .json({ message: "That blog cound not be found." });
      if (blog?.images.length > 0) {
        blog.images.forEach(
          async (img: any) => await cloudinary.uploader.destroy(img.fileId)
        );
      }
      await User.findOneAndUpdate(
        { email: process.env.EMAIL_USER },
        { $inc: { blogCount: -1 } }
      );
      return res.json("Blog deleted successfully");
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "Invalid request" });
  }
};

export default Protect(handler);
