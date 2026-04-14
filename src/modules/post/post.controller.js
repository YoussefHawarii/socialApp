import { Router } from "express";
import isAuthenticate from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import endpoints from "../../modules/post/post.endpoint.js";
import { uploadCloud } from "../../utils/fileUploading/multerUploadCloudinary.js";
import { fileValidation } from "../../utils/fileUploading/multerUpload.js";
import validation from "../../middleware/validation.middleware.js";
import * as postSchemas from "./post.validation.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import * as postservice from "./post.service.js";
import commentRouter from "../comment/comment.controller.js";

const router = Router();

// /post/:postId/comment >>>>>>> commentRouter
router.use("/:postId/comment", commentRouter);

//create post
router.post(
  "/createPost",
  isAuthenticate,
  isAuthorized(endpoints.createPost),
  uploadCloud(fileValidation.images).array("images"),
  validation(postSchemas.createPost),
  asyncHandler(postservice.createPost),
);

//update post
router.patch(
  "/updatePost/:id",
  isAuthenticate,
  isAuthorized(endpoints.updatePost),
  uploadCloud(fileValidation.images).array("images"),
  validation(postSchemas.updatePost),
  asyncHandler(postservice.updatePost),
);

// soft delete post
router.patch(
  "/softDeletePost/:id",
  isAuthenticate,
  isAuthorized(endpoints.softDeletePost),
  uploadCloud(fileValidation.images).array("images"),
  validation(postSchemas.softDeletePost),
  asyncHandler(postservice.softDeletePost),
);

// restore post
router.patch(
  "/restorePost/:id",
  isAuthenticate,
  isAuthorized(endpoints.restorePost),
  uploadCloud(fileValidation.images).array("images"),
  validation(postSchemas.restorePost),
  asyncHandler(postservice.restorePost),
);

// get single post
router.get(
  "/getPost/:id",
  isAuthenticate,
  isAuthorized(endpoints.getSinglePost),
  uploadCloud(fileValidation.images).array("images"),
  validation(postSchemas.getSinglePost),
  asyncHandler(postservice.getPost),
);

// get all active posts
router.get(
  "/getAllActivePosts",
  isAuthenticate,
  isAuthorized(endpoints.getAllActivePosts),
  uploadCloud(fileValidation.images).array("images"),
  asyncHandler(postservice.getAllActivePosts),
);

// get all nonActive posts
router.get(
  "/getAllnonActivePosts",
  isAuthenticate,
  isAuthorized(endpoints.getAllnonActivePosts),
  uploadCloud(fileValidation.images).array("images"),
  asyncHandler(postservice.getAllnonActivePosts),
);

//like and unlike posts
router.patch(
  "/:id/like-unlike",
  isAuthenticate,
  isAuthorized(endpoints.likePost),
  validation(postSchemas.likePost),
  asyncHandler(postservice.likeAndUnlikePost),
);

export default router;
