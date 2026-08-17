import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URI);
    console.log("DB connected successfully");
  } catch (error) {
    // Deliberately not re-thrown: a connection failure here would otherwise crash the whole
    // serverless function at module init (before Express finishes booting). Letting bootstrap()
    // continue means DB-dependent routes still fail, but through the normal asyncHandler ->
    // globalErrorHandler path with a proper JSON response instead of a raw platform crash.
    console.log("DB connection error", error.message);
  }
};

export default connectDB;
