import mongoose from "mongoose";

const connectDB = async () => {
  mongoose
    .connect(process.env.CONNECTION_URI)
    .then(() => {
      console.log("DB connected succssfully");
    })
    .catch((error) => {
      console.log("DB connection error", error.message);
    });
};

export default connectDB;
