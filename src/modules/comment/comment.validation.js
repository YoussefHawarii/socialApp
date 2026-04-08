import joi from "joi";
import { fileObj, isValidObjectId } from "../../middleware/validation.middleware.js";

export const createComment = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object(fileObj),
  })
  .or("text", "file");

export const updateComment = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object(fileObj),
  })
  .or("text", "file");

export const softDeleteComment = joi.object({
  id: joi.custom(isValidObjectId).required(),
});
export const getComment = joi.object({
  postId: joi.custom(isValidObjectId).required(),
});

export const like_unlikeComment = joi.object({
  id: joi.custom(isValidObjectId).required(),
});

export const replyComment = joi
  .object({
    postId: joi.custom(isValidObjectId).required(),
    id: joi.custom(isValidObjectId).required(),
    text: joi.string(),
    file: joi.object(fileObj),
  })
  .or("text", "file");

export const hardDeleteComment = joi.object({
  id: joi.custom(isValidObjectId).required(),
});
