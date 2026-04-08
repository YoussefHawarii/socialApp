import { roles } from "../../DB/models/user.model.js";

export const endPoints = {
  createComment: [roles.user],
  updateComment: [roles.user],
  softDeleteComment: [roles.user, roles.admin],
  getComment: [roles.user, roles.admin],
  like_unlikeComment: [roles.user],
  replyComment: [roles.user],
  hardDeleteComment: [roles.user, roles.admin],
};
