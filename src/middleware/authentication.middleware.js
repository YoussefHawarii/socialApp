import User from "../DB/models/user.model.js";
import { asyncHandler } from "../utils/errors/asyncHandler.js";
// import asyncHandler from "express-async-handler";
import { verifyToken } from "../utils/token/token.js";

const isAuthenticate = asyncHandler(async (req, res, next) => {
  let { authorization } = req.headers;

  //check token found
  if (!authorization) {
    return next(new Error("token required", { cause: 403 }));
  }

  // get token from header with Bearer format.
  if (!authorization.startsWith("Bearer ")) {
    return next(new Error("invalid token format", { cause: 403 }));
  }
  const token = authorization.split(" ")[1];
  //verify token
  const decoded = verifyToken({ token });
  const { id } = decoded;
  //fetch user data
  const user = await User.findById(id).select("-password").lean();
  if (!user) return next(new Error("user not found", { cause: 403 }));

  if (user.changedAt?.getTime() >= decoded.iat * 1000) return next(new Error("please login again", { cause: 403 }));

  req.user = user;
  return next();
});

export default isAuthenticate;
