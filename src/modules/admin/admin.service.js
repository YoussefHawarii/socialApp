import User from "../../DB/models/user.model.js";
import Post from "../../DB/models/post.model.js";

export const getUsersAndPosts = async (req, res, next) => {
  const results = await Promise.all([User.find(), Post.find()]);
  return res.json({ success: true, results });
};

export const changeUserRole = async (req, res, next) => {
  const { userId, role } = req.body;
  const user = await User.findByIdAndUpdate({ _id: userId }, { role });
  return res.json({ success: true, message: "User role updated successfully" });
};
