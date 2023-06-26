import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import createSendToken from "../../../utils/createSendToken";
import applyRateLimitShort from "../../../utils/applyRateLimitingShort";
import fetchGoogleScore from "../../../utils/fetchGoogleScore";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST")
    return res.status(401).json({ message: "Invalid request" });

  const { email, password, gReCaptchaToken } = req.body;

  if (!email || !password || !gReCaptchaToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    await applyRateLimitShort(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }

  try {
    const reCaptchaRes = await fetchGoogleScore(gReCaptchaToken);

    if (!reCaptchaRes)
      return res.status(401).json({ message: "Unexpected error" });

    await connectDB();

    //2.) Check if user with this username exists
    const user = await User.findOne({ email }).select("+password").exec();
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }

    // Awaiting createSendToken removes a weird error from the console about not sending a response

    await createSendToken(user, 200, req, res);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
