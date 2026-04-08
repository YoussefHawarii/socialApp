import { EventEmitter } from "events";
import jwt from "jsonwebtoken";
import sendEmails from "./sendEmails.js";
import { signUp, verifyOTP } from "./generateHTML.js";

export const emailEmitter = new EventEmitter();

/* emailEmitter.on("sendEmail", async ({ email, userName }) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
  const link = `http://localhost:3000/auth/activate_account/${token}`;
  await sendEmails({
    to: email,
    subject: subjects.register,
    html: signUp(userName, link),
  });
});
 */
emailEmitter.on("sendOTPEmail", async ({ email, otp, subject }) => {
  await sendEmails({
    to: email,
    subject,
    html: verifyOTP(email, otp),
  });
});
