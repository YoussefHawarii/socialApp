import { Router } from "express";
import isAuthenticate from "../../middleware/authentication.middleware.js";
import isAuthorized from "../../middleware/authorization.middleware.js";
import endpoints from "../../modules/admin/admin.endpoints.js";
import validation from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../utils/errors/asyncHandler.js";
import * as adminSchema from "./admin.validation.js";
import * as adminService from "./admin.service.js";
import { canChangeRole } from "./admin.middleware.js";

const router = Router();

//get all users and posts
router.get(
  "/",
  isAuthenticate,
  isAuthorized(endpoints.getUsersAndPosts),
  validation(adminSchema.getUsersAndPosts),
  asyncHandler(adminService.getUsersAndPosts),
);

// change role
router.patch(
  "/role",
  isAuthenticate,
  isAuthorized(endpoints.changeUserRole),
  validation(adminSchema.changeUserRole),
  canChangeRole,
  asyncHandler(adminService.changeUserRole),
);

export default router;
