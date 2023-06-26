import mongoose from "mongoose";

const connectDB = async () => {
  const connectionString =
    process.env.NODE_ENV !== "production"
      ? process.env.LOCAL_MONGO_URI
      : process.env.LIVE_MONGO_URI;

  console.log("======================================================");
  console.log(process.env.LIVE_MONGO_URI);
  console.log(process.env.NODE_ENV);
  console.log(process.env.GOOGLE_CAPTCHA_SECRET_KEY);
  console.log(process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.LIVE_SITE);
  console.log("======================================================");

  // mongoose.set("strictQuery", false);
  return mongoose
    .connect(connectionString!)
    .then(() => {
      // console.log("DB Connection Successful");
    })
    .catch((err) => {
      console.error(err);
    });
};

export default connectDB;
