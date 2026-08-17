import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URI);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection error", error.message);
    throw error;
  }
};

export default connectDB;
