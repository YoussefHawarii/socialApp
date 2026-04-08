import User, { roles } from "../../DB/models/user.model.js";

export const canChangeRole = async (req, res, next) => {
  const allRoles = Object.values(roles);

  const userReq = req.user; // get the user making the request
  const targetUser = await User.findById(req.body.userId); // get the target user

  const userReqRole = userReq.role; // get the role of the user making the request
  const targetUserRole = targetUser.role; // get the role of the target user
  // Check if the user making the request has a higher role than the target user
  const userReqIndex = allRoles.indexOf(userReqRole);
  const targetUserIndex = allRoles.indexOf(targetUserRole);
  const canChange = userReqIndex < targetUserIndex; // lower index means higher role
  if (!canChange) return res.status(403).json({ success: false, message: "You do not have permission to change this user's role" });
  return next();
};
