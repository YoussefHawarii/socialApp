import Joi from "joi";
import { generalFields, isValidObjectId } from "../../middleware/validation.middleware.js";

export const updateProfileSchema = Joi.object({
  userName: generalFields.userName,
}).required();

export const changePasswordSchema = Joi.object({
  oldPassword: generalFields.password.required(),
  password: generalFields.password.required(),
  confirmPassword: generalFields.password.not(Joi.ref("oldPassword")).required(),
}).required();

export const updateEmailSchema = Joi.object({
  email: generalFields.email.required(),
  password: generalFields.password.required(),
}).required();

export const friendIdSchema = Joi.object({
  friendId: Joi.custom(isValidObjectId).required(),
}).required();

export const acceptfriendIdSchema = Joi.object({
  friendId: Joi.custom(isValidObjectId).required(),
}).required();

export const searchUsersSchema = Joi.object({
  userName: Joi.string().min(2).max(25).required(),
  page: Joi.number().integer().min(1),
}).required();
