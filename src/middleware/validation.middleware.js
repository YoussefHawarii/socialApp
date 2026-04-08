import { Types } from "mongoose";
import joi from "joi";
//validate
const validation = (schema) => {
  return (req, res, next) => {
    //body params query
    const data = { ...req.body, ...req.params, ...req.query };
    // req.file || req.files
    if (req.file || req.files?.length) {
      data.file = req.file || req.files;
    }
    const result = schema.validate(data, { abortEarly: false });
    if (result.error) {
      const messageList = result.error.details.map((obj) => obj.message);
      return next(new Error(messageList, { cause: 400 }));
    }
    return next();
  };
};

export const isValidObjectId = (value, helper) => {
  //check if the value is ObjectId
  if (Types.ObjectId.isValid(value)) return true;
  return helper.message("invalid ObjectId!");
};

export const generalFields = {
  email: joi.string().email(),
  otp: joi.string().length(5),
  password: joi.string(),
  confirmPassword: joi.string().valid(joi.ref("password")),
  userName: joi.string().min(5).max(15),
};

export const fileObj = {
  fieldname: joi.string().valid("images").required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
  size: joi.number().required(),
  destination: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
};

export default validation;
