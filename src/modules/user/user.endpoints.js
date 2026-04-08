import { roles } from "../../DB/models/user.model.js";

const endPoints = {
  profile: [roles.user, roles.admin],
  updateProfile: [roles.user],
  changePassword: [roles.user],
  deactivateAccount: [roles.user],
  updateEmail: [roles.user],
  uploadProfilePicture: [roles.user],
};
export default endPoints;
