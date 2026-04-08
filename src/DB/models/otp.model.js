import { model, Schema } from "mongoose";
//schema
const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
  },
  { timestamps: true },
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 }); //expire after 5 minutes;
//model
const OTP = model("OTP", otpSchema);
export default OTP;
