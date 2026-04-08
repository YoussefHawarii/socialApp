import { Router } from "express";
import * as userServices from "./user.service.js";
import isAuthenticate from "../../middleware/authentication.middleware.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import validation from "../../middleware/validation.middleware.js";
import * as userValidation from "./user.validation.js";
import endPoints from "./user.endpoints.js";
import { fileValidation, upload } from "../../utils/fileUploading/multerUpload.js";
import { uploadCloud } from "../../utils/fileUploading/multerUploadCloudinary.js";
// import asyncHandler from "express-async-handler";

const router = Router();

//access profile
//prettier-ignore
router.get("/profile",
  isAuthenticate,
  isAuthorized(endPoints.profile),
  asyncHandler(userServices.profile));

//update profile
router.patch(
  "/profile",
  isAuthenticate,
  isAuthorized(endPoints.updateProfile),
  validation(userValidation.updateProfileSchema),
  asyncHandler(userServices.updateProfile),
);

//change password
router.patch(
  "/change-password",
  isAuthenticate,
  isAuthorized(endPoints.changePassword),
  validation(userValidation.changePasswordSchema),
  asyncHandler(userServices.changePassword),
);

//deactivate account(soft delete)
//prettier-ignore
router.delete("/deactivate",
  isAuthenticate,
  isAuthorized(endPoints.deactivateAccount),
  asyncHandler(userServices.deactivateAccount));

//update email
router.patch(
  "/update-email",
  isAuthenticate,
  isAuthorized(endPoints.updateEmail),
  validation(userValidation.updateEmailSchema),
  asyncHandler(userServices.updateEmail),
);
//email verification
router.get("/verify-email/:token", asyncHandler(userServices.verifyTempEmail));

//profile picture uploading using file system
/* router.post(
  "/profilePicture",
  isAuthenticate,
  isAuthorized(endPoints.uploadProfilePicture),
  upload(fileValidation.images,"uploads/users").single("profilePicture"),
  asyncHandler(userServices.uploadProfilePicture),
); */

//profile picture uploading using cloudinary
router.post(
  "/profilePicture",
  isAuthenticate,
  isAuthorized(endPoints.uploadProfilePicture),
  uploadCloud(fileValidation.images).single("profilePicture"),
  asyncHandler(userServices.uploadProfilePictureCloudinary),
);

//delete profile picture from file system
/* router.delete(
  "/profilePicture",
  isAuthenticate,
  isAuthorized(endPoints.uploadProfilePicture),
  asyncHandler(userServices.deleteProfilePicture),
); */

//delete profile picture from cloudinary
router.delete(
  "/profilePicture",
  isAuthenticate,
  isAuthorized(endPoints.uploadProfilePicture),
  asyncHandler(userServices.deleteProfilePictureCloudinary),
);

//  multiple picture uploading using file system
/* router.post(
  "/upload-multi-picture",
  isAuthenticate,
  isAuthorized(endPoints.uploadProfilePicture),
  upload(fileValidation.images, "uploads/users").array("pictures"),
  asyncHandler(userServices.uploadMultiplePictures),
); */

export default router;
