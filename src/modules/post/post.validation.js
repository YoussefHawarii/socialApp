import joi from "joi";
import { fileObj, isValidObjectId } from "../../middleware/validation.middleware.js";

export const createPost = joi
  .object({
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObj)),
  })
  .or("text", "file");

export const updatePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
    text: joi.string().min(2),
    file: joi.array().items(joi.object(fileObj)),
  })
  .or("text", "file");

export const getSinglePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const softDeletePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const restorePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();

export const likePost = joi
  .object({
    id: joi.custom(isValidObjectId).required(),
  })
  .required();
