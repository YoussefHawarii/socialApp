import joi from "joi";
import { generalFields } from "../../middleware/validation.middleware.js";
import { roles } from "../../DB/models/user.model.js";

//register schema
export const register = joi
  .object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required(),
    userName: generalFields.userName,
    role: joi.string().valid(...Object.values(roles)),
  })
  .required();

// login schema
export const login = joi
  .object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  })
  .required();

//send OTP schema
export const sendOTP = joi
  .object({
    email: generalFields.email.required(),
  })
  .required();

//forget password schema
export const forgetPassword = joi
  .object({
    email: generalFields.email.required(),
  })
  .required();

//reset password schema
export const resetPassword = joi
  .object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required(),
  })
  .required();

//refresh token schema
export const refreshToken = joi
  .object({
    refresh_token: joi.string().required(),
  })
  .required();

//google login schema
export const googleLogin = joi
  .object({
    idToken: joi.string().required(),
  })
  .required();
