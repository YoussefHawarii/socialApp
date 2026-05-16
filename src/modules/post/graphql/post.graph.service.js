// add in this file the resolve functions => business logic

import Post from "../../../DB/models/post.model.js";

export const allPosts = async (parent, args, context) => {
  const posts = await Post.find().populate("user");
  return { success: true, statusCode: 200, results: posts };
};

export const onePost = async (parent, args, context) => {
  const { id } = args;
  const post = await Post.findById(id).populate("user");
  return { success: true, statusCode: 200, results: post };
};
