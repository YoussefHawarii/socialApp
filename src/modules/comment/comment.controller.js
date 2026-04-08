import { Router } from "express";
import isAuthenticate from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import { endPoints } from "./comment.endpoint.js";
import { uploadCloud } from "../../utils/fileUploading/multerUploadCloudinary.js";
import { fileValidation } from "../../utils/fileUploading/multerUpload.js";
import validation from "../../middleware/validation.middleware.js";
import * as commentSchema from "./comment.validation.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import * as commentService from "./comment.service.js";

const router = Router({ mergeParams: true });

//create Comment
router.post(
  "/",
  isAuthenticate,
  isAuthorized(endPoints.createComment),
  uploadCloud(fileValidation.images).single("images"),
  validation(commentSchema.createComment),
  asyncHandler(commentService.createComment),
);

//update comment
router.patch(
  "/:id",
  isAuthenticate,
  isAuthorized(endPoints.updateComment),
  uploadCloud(fileValidation.images).single("images"),
  validation(commentSchema.updateComment),
  asyncHandler(commentService.updateComment),
);

//delete comment
router.patch(
  "/:id/delete",
  isAuthenticate,
  isAuthorized(endPoints.softDeleteComment),
  validation(commentSchema.softDeleteComment),
  asyncHandler(commentService.softDeleteComment),
);

//all comments
//prettier-ignore
router.get(
    "/",
    isAuthenticate,
    isAuthorized(endPoints.getComment),
    validation(commentSchema.getComment),
    asyncHandler(commentService.getComment));

//like-unlike comment
router.patch(
  "/:id/like-unlike",
  isAuthenticate,
  isAuthorized(endPoints.like_unlikeComment),
  validation(commentSchema.like_unlikeComment),
  asyncHandler(commentService.likeUnlikeComment),
);
export default router;

//reply to comment
router.post(
  "/:id", //* /post/:postId/comments/:id
  isAuthenticate,
  isAuthorized(endPoints.replyComment),
  uploadCloud(fileValidation.images).single("images"),
  validation(commentSchema.replyComment),
  asyncHandler(commentService.replyComment),
);

//delete comment
router.delete(
  "/:id",
  isAuthenticate,
  isAuthorized(endPoints.hardDeleteComment),
  validation(commentSchema.hardDeleteComment),
  asyncHandler(commentService.hardDeleteComment),
);
