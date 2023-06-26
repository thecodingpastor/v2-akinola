import { NextApiRequest, NextApiResponse } from "next";

import fetchGoogleScore from "../../utils/fetchGoogleScore";
import applyRateLimitShort from "../../utils/applyRateLimitingShort";
import SendEmail from "../../utils/sendEmail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await applyRateLimitShort(req, res);
  } catch {
    return res.status(429).json({ message: "Too many requests" });
  }

  if (req.method !== "POST")
    return res.status(401).json({ message: "Invalid request." });

  const { FullName, Email, Message, gReCaptchaToken } = req.body;

  try {
    const reCaptchaRes = await fetchGoogleScore(gReCaptchaToken);

    if (!reCaptchaRes)
      return res.status(401).json({
        message: "Unexpected error",
      });

    const email = await SendEmail({
      to: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER,
      html: `
            <h3>${FullName} reached out to you.</h3>
            <p>${Message}</p>
          `,
      subject: "Message from michaelakinola.com",
      replyTo: Email,
    });
    console.log("==================================");
    console.log(email);
    console.log("==================================");

    res.json("ok");
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

export default handler;
