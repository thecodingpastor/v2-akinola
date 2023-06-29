import { NextApiRequest, NextApiResponse } from "next";

import connectDB from "../../../utils/connectDB";
import User from "../../../models/userModel";
import applyRateLimitShort from "../../../utils/applyRateLimitingShort";
import fetchGoogleScore from "../../../utils/fetchGoogleScore";
import SendEmail from "../../../utils/sendEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await applyRateLimitShort(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }
  if (req.method === "POST") {
    const { ForgotPasswordEmail, gReCaptchaToken } = req.body;

    if (!ForgotPasswordEmail || !gReCaptchaToken) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    try {
      const reCaptchaRes = await fetchGoogleScore(gReCaptchaToken);

      if (!reCaptchaRes)
        return res.status(401).json({ message: "Unexpected error" });

      await connectDB();

      const user = await User.findOne({ email: ForgotPasswordEmail });
      if (!user)
        return res.json({
          message:
            "If you have an account with us, a message has been sent to your registered email address for further instructions.",
        });

      const resetToken = crypto.randomUUID();

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      const resetURL =
        process.env.NODE_ENV === "production"
          ? `${process.env.LIVE_SITE}/reset-password?token=${resetToken}`
          : `http://localhost:3000/reset-password?token=${resetToken}`;

      const mail = `Click on this link ${resetURL} to change your password.It expires in 10 minutes. \nIf you didn't initiate this, please contact the developer.`;

      await SendEmail({
        from: process.env.EMAIL_USER,
        html: mail,
        subject: "Password Reset",
        to: ForgotPasswordEmail,
      });

      return res.json("ok");
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  } else if (req.method === "PATCH") {
    const { token, gReCaptchaToken, password_reset, confirm_password_reset } =
      req.body;

    if (password_reset !== confirm_password_reset)
      return res.status(400).json({ message: "Passwords do not match" });

    try {
      const reCaptchaRes = await fetchGoogleScore(gReCaptchaToken);

      if (!reCaptchaRes)
        return res.status(401).json({ message: "Unexpected error" });

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });

      if (!user)
        return res.status(400).json({
          message: "Invalid or expired token.",
        });

      user.password = password_reset;
      user.refreshToken = "";
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.json({ message: "ok" });
    } catch (err: any) {
      return res.status(500).json({ message: err.message });
    }
  } else {
    return res.status(401).json({ message: "Invalid request" });
  }
};

export default handler;
