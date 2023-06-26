import mongoose from "mongoose";

const connectDB = async () => {
  const connectionString =
    process.env.NODE_ENV !== "production"
      ? process.env.LOCAL_MONGO_URI
      : process.env.LIVE_MONGO_URI;

  console.log("=================================");
  console.log(" live site => ", process.env.LIVE_SITE);
  console.log("host => ", process.env.EMAIL_HOST);
  console.log("user => ", process.env.EMAIL_USER);
  console.log("user => ", process.env.EMAIL_SERVICE);

  console.log("=================================");

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
