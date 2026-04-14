import { Router } from "express";
import * as authServices from "./auth.service.js";
import { asyncHandler } from "./../../utils/errors/asyncHandler.js";
// import asyncHandler from "express-async-handler";
import validation from "../../middleware/validation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();

//send OTP
router.post("/verify",
validation(authValidation.sendOTP),
asyncHandler(authServices.sendOTP));

// register
router.post("/register",
validation(authValidation.register),
asyncHandler(authServices.register));

//activate account
router.get("/activate_account/:token",
asyncHandler(authServices.activate_account));

// login
router.post("/login", validation(authValidation.login),asyncHandler(authServices.login));

//forget password
router.post("/forget_password",
validation(authValidation.forgetPassword),
asyncHandler(authServices.forget_password));

//reset password
router.post("/reset_password",
validation(authValidation.resetPassword),
asyncHandler(authServices.reset_password));

//refresh token
router.get("/refresh_token",
    validation(authValidation.refreshToken),
    asyncHandler(authServices.refresh_token));

//login with google
router.post("/google_login",
validation(authValidation.googleLogin),
asyncHandler(authServices.google_login)); 


export default router;


