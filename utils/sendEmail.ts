import Nodemailer from "nodemailer";

// @ts-ignore
const SendEmail = async ({ from, to, subject, html, replyTo = "" }) => {
  // you can add reply_to as the fifth arg

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

  return data;
};

export default SendEmail;
