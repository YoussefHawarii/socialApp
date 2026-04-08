import { roles } from "../../DB/models/user.model.js";

const endpoints = {
  getUsersAndPosts: [roles.admin, roles.superAdmin],
  changeUserRole: [roles.admin, roles.superAdmin],
};

export default endpoints;
