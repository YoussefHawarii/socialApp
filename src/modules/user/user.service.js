import User, { cloudinaryPublicId, cloudinarySecureUrl, defaultProfilePicture } from "../../DB/models/user.model.js";
import sendEmails, { subjects } from "../../utils/emails/sendEmails.js";
import { compare, hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import { verifyNewEmail } from "../../utils/emails/generateHTML.js";
import fs from "fs";
import path from "path";
import cloudinary from "../../utils/fileUploading/cloudinary.config.js";

export const profile = async (req, res, next) => {
  //req.user = {email,username,phoneNumber,gender,role}
  const { user } = req;

  return res.status(201).json({ success: true, results: { ...user } });
};

export const updateProfile = async (req, res, next) => {
  const results = await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    {
      returnDocument: "after",
      /**
       * ! run validators must be true to check the schema from model file and follow the validation rules
       */
      runValidators: true,
    },
  );
  return res.status(201).json({ success: true, results });
};

export const changePassword = async (req, res, next) => {
  const { oldPassword, password } = req.body;
  /**
   * ! in the authentication.middleware i removed the password field from req.body that's why
   * ! i need to get the user from DB to compare the old password with the password in DB and
   * ! if it's correct then i will hash the new password and update it in DB.
   */
  const user = await User.findById(req.user._id);
  const comparePassword = compare({
    plainText: oldPassword,
    hash: user.password,
  });
  if (!comparePassword) return next(new Error("old password is incorrect", { cause: 400 }));

  const hashPassword = hash({ plainText: password });

  await User.findByIdAndUpdate(
    req.user._id,
    { password: hashPassword, changedAt: Date.now() },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );
  return res.status(201).json({ success: true, message: "password changed successfully" });
};

export const deactivateAccount = async (req, res, next) => {
  const data = await User.findByIdAndUpdate(
    req.user._id,
    { isDeleted: true, changedAt: Date.now() },
    { returnDocument: "after", runValidators: true },
  );
  return res.status(201).json({ success: true, message: "account deactivated successfully", data });
};

export const updateEmail = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findById(req.user._id);
  //* compare the password with the password in DB to make sure that the user is the owner of the account and can update the email
  if (!compare({ plainText: password, hash: user.password })) return next(new Error("password is incorrect", { cause: 400 }));
  //* save new email in tempEmail field
  user.tempEmail = email;
  await user.save();
  //* generate token and send email to the user to verify the new email
  const token = generateToken({ payload: { id: user._id, email } });
  const url = `http://localhost:3000/user/verify-email/${token}`;

  await sendEmails({
    to: email,
    subject: subjects.verifyNewEmail,
    html: verifyNewEmail(user.userName, url),
  });

  return res.json({ success: true, message: "verification email sent" });
};

export const verifyTempEmail = async (req, res, next) => {
  const { token } = req.params;
  const { email, id } = verifyToken({ token });
  const user = await User.findById(id);
  if (!user) return next(new Error("invalid token", { cause: 400 }));
  user.email = user.tempEmail;
  user.tempEmail = null;
  await user.save();
  return res.json({ success: true, message: "email updated successfully" });
};

export const uploadProfilePicture = async (req, res, next) => {
  //req.file = {path, filename, originalname}
  const { path } = req.file;
  const user = await User.findByIdAndUpdate(req.user._id, { profilePicture: path }, { returnDocument: "after", runValidators: true });
  return res.status(201).json({ success: true, message: "profile picture uploaded successfully", results: { user } });
};

export const uploadProfilePictureCloudinary = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  // upload file to cloudinary => req.file.path
  const { public_id, secure_url } = await cloudinary.uploader.upload(req.file.path, { folder: `users/${user._id}/profilePicture` });
  //save link in user document
  user.profilePicture = { secure_url, public_id };
  await user.save();
  return res.status(201).json({ success: true, results: { user } });
};

export const deleteProfilePicture = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const imgPath = path.resolve(".", user.profilePicture);
  fs.unlinkSync(imgPath);
  user.profilePicture = defaultProfilePicture;
  await user.save();
  res.json({ success: true, message: "profile picture deleted successfully", results: { user } });
};

export const deleteProfilePictureCloudinary = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const results = await cloudinary.uploader.destroy(user.profilePicture.public_id);
  if (results.result == "ok") {
    user.profilePicture = { public_id: cloudinaryPublicId, secure_url: cloudinarySecureUrl };
    await user.save();
  }
  res.json({ success: true, message: "profile picture deleted successfully", results });
};
export const uploadMultiplePictures = async (req, res, next) => {
  //req.files = [{path, filename, originalname}]
  const user = await User.findById(req.user._id);
  user.pictures = req.files.map((file) => file.path);
  await user.save();

  return res.status(201).json({ success: true, message: "pictures uploaded successfully" });
};
