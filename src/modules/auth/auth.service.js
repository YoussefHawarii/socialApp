import User from "./../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { emailEmitter } from "../../utils/emails/email.event.js";
import { compare } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import Randomstring from "randomstring";
import OTP from "../../DB/models/otp.model.js";
import { subjects } from "../../utils/emails/sendEmails.js";
import { OAuth2Client } from "google-auth-library";

export const register = async (req, res, next) => {
  const { otp, email } = req.body;

  const otpExist = await OTP.findOne({ otp, email });
  if (!otpExist) {
    return next(new Error("invalid OTP", { cause: 400 }));
  }
  //create
  await User.create({
    ...req.body,
    //hash password in pre save hook in user model
    isActivated: true,
  });

  //email(link)
  /*   emailEmitter.emit("sendEmail", {
    email: req.body.email,
    userName: data.userName,
  }); */

  return res.status(201).json({ success: true, message: "User Created Successfully" });
};

export const activate_account = async (req, res, next) => {
  // verify user coming from register
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("user not found", { cause: 400 }));
  }
  user.isActivated = true;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "account activated successfully, Now try to login",
  });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // check user existence
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("invalid Email", { cause: 400 }));
  }
  //check if account is active
  if (!user.isActivated) {
    return next(new Error("account must be activated first", { cause: 400 }));
  }

  // check password
  if (!compare({ plainText: password, hash: user.password })) return next(new Error("invalid Password", { cause: 400 }));

  //generate token
  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
  });
  const refresh_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  });
  return res.status(201).json({ success: true, message: "login Successfully", access_token, refresh_token });
};

export const sendOTP = async (req, res, next) => {
  const { email } = req.body;
  //check user existence
  const user = await User.findOne({ email });
  if (user) {
    return next(new Error("user already exists", { cause: 400 }));
  }
  //generate OTP
  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  //save OTP in DB
  await OTP.create({ email, otp });
  //send OTP in email
  emailEmitter.emit("sendOTPEmail", {
    email,
    otp,
    subject: subjects.otp,
  });
  return res.status(200).json({ success: true, message: "OTP sent to your email" });
};

export const forget_password = async (req, res, next) => {
  const { email } = req.body;
  //check user existence
  const user = await User.findOne({ email, isActivated: true });
  if (!user) {
    return next(new Error("invalid Email", { cause: 400 }));
  }
  //generate OTP
  const otp = Randomstring.generate({ length: 5, charset: "alphanumeric" });
  //save OTP in DB
  await OTP.create({ email, otp });
  //send OTP in email
  emailEmitter.emit("sendOTPEmail", {
    email,
    otp,
    subject: subjects.resetPass,
  });
  return res.status(200).json({ success: true, message: "OTP sent to your email" });
};

export const reset_password = async (req, res, next) => {
  const { email, otp, password } = req.body;
  //check user existence
  const user = await User.findOne({ email, isActivated: true });
  if (!user) {
    return next(new Error("invalid Email", { cause: 400 }));
  }
  //check OTP
  const otpExist = await OTP.findOne({ otp, email });
  if (!otpExist) {
    return next(new Error("invalid OTP", { cause: 400 }));
  }
  //hash password in pre save hook in user model
  user.password = password;
  await user.save();
  return res.status(200).json({ success: true, message: "password reset successfully" });
};

export const refresh_token = async (req, res, next) => {
  const { refresh_token } = req.body;
  const payload = verifyToken({ token: refresh_token });
  if (!payload) {
    return next(new Error("invalid refresh token", { cause: 400 }));
  }
  const user = await User.findById(payload.id);
  if (!user) {
    return next(new Error("invalid refresh token", { cause: 400 }));
  }
  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
  });
  return res.status(200).json({ success: true, message: "access token refreshed successfully", access_token });
};

export const google_login = async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const userData = await verify();
  const { email_verified, email, name, picture } = userData;
  if (!email_verified) return next(new Error("invalid Email", { cause: 400 }));
  //creation
  const user = await User.create({
    email,
    userName: name,
    isActivated: true,
    provider: providers.google,
  });
  //generate token
  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN },
  });
  const refresh_token = generateToken({
    payload: { id: user._id, email: user.email },
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  });
  return res.status(201).json({ success: true, message: "login Successfully", access_token, refresh_token });
};
