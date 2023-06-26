import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import BlogPost from "../../../models/blogPost";
import Project from "../../../models/project";
import User from "../../../models/userModel";
import applyRateLimitShort from "../../../utils/applyRateLimitingShort";
import Protect from "../../../middleware/protect";
import slugify from "../../../utils/slugify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await applyRateLimitShort(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }
  if (req.method === "POST") {
    const { title, description, isTeam, githubLink } = req.body;

    try {
      await connectDB();
      const project = await Project.create({
        title,
        description,
        isTeam,
        githubLink,
        slug: slugify(title),
      });
      if (!project)
        return res.status(400).json({ message: "Could not create a project." });

      res.json(project);
    } catch (err: any) {
      if (err.code === 11000)
        return res
          .status(400)
          .json({ message: `The project "${title}" has been created before.` });
      return res.status(500).json({
        message: err.message || "Could not fetch blogs. Please try later",
      });
    }
  } else if (req.method === "DELETE") {
    const { slug } = req.query;
    if (!slug) return res.status(401).json({ message: "Invalid parameters." });

    try {
      await Project.findOneAndDelete({ slug });
      return res.json("ok");
    } catch (err: any) {
      res
        .status(500)
        .json({ message: err.message || "Unable to delete the project" });
    }
  } else if (req.method === "PATCH") {
    const { title, description, isTeam, githubLink, slug } = req.body;
    try {
      const project = await Project.findOneAndUpdate(
        { slug },
        { title, description, isTeam, githubLink },
        { new: true, runValidators: true }
      );
      return res.json(project);
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: err.message || "Could not update the project." });
    }
  } else {
    return res.status(401).json({ message: "Invalid request" });
  }
};

export default Protect(handler);
