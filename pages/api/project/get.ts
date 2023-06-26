import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import Project from "../../../models/project";
import applyRateLimit from "../../../utils/applyRateLimiting";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(401).json({ message: "Invalid request." });
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    await connectDB();
    const projects = await Project.find();

    if (!projects)
      return res
        .status(500)
        .json({ message: "Could not fetch projects at this time" });

    res.json(projects);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Could not fetch projects. Please try later",
    });
  }
};

export default handler;
