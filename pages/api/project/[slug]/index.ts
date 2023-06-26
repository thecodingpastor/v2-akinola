import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../../utils/connectDB";
import Project from "../../../../models/project";
import applyRateLimit from "../../../../utils/applyRateLimiting";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(401).json({ message: "Invalid request." });
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }
  const { slug } = req.query;

  try {
    await connectDB();
    const project = await Project.findOne({ slug });

    if (!project)
      return res
        .status(500)
        .json({ message: "Could not fetch project at this time" });

    res.json(project);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Could not fetch projects. Please try later",
    });
  }
};

export default handler;
