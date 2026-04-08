import { roles } from "../../DB/models/user.model.js";

const endpoints = {
  createPost: [roles.user],
  updatePost: [roles.user],
  softDeletePost: [roles.user, roles.admin],
  restorePost: [roles.user, roles.admin],
  getSinglePost: [roles.user, roles.admin],
  getAllActivePosts: [roles.user, roles.admin],
  likePost: [roles.user],
};

export default endpoints;
