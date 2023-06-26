import Nodemailer from "nodemailer";
import axios from "axios";
// @ts-ignore
const SendEmail = async ({ from, to, subject, html, replyTo = "" }) => {
  // you can add reply_to as the fifth arg
  console.log("==================================");
  console.log({ from, to, subject, html, replyTo });
  console.log("==================================");
  const transporter = Nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    // port: 587,
    secure: false,
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // This is to prevent email failure
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
    replyTo,
  };

  const data = await transporter.sendMail(mailOptions);
  console.log("==================================");
  console.log(data);
  console.log("==================================");

  return data;
};

export default SendEmail;
